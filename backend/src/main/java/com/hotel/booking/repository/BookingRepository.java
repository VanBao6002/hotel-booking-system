package com.hotel.booking.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingRoomDTO;

@Repository
public class BookingRepository {
    private final JdbcTemplate jdbcTemplate;
    private final DatabaseSchemaInspector schemaInspector;

    public BookingRepository(JdbcTemplate jdbcTemplate, DatabaseSchemaInspector schemaInspector) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemaInspector = schemaInspector;
    }

    // Lay tat ca booking cho admin. Ho tro ca schema cu (booking.room_id) va schema moi (booking_room).
    public List<BookingDTO> getAllBookings() {
        BookingSchema schema = bookingSchema();
        List<BookingDTO> bookings = jdbcTemplate.query(
            adminBookingSql(schema) + " ORDER BY b.booked_at DESC, b.id DESC",
            bookingMapper()
        );
        hydrateBookingRooms(bookings, schema);
        return bookings;
    }

    // Lay booking theo ID
    public Optional<BookingDTO> getBookingById(int id) {
        BookingSchema schema = bookingSchema();
        List<BookingDTO> rows = jdbcTemplate.query(
            adminBookingSql(schema) + " WHERE b.id = ?",
            bookingMapper(),
            id
        );
        hydrateBookingRooms(rows, schema);
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    // Lay booking theo RoomID
    public List<BookingDTO> getBookingsByRoomID(int roomId) {
        BookingSchema schema = bookingSchema();
        String whereClause = schema.hasBookingRoomTable()
            ? " WHERE EXISTS (SELECT 1 FROM booking_room br_filter WHERE br_filter.booking_id = b.id AND br_filter.room_id = ?)"
            : " WHERE b.room_id = ?";

        List<BookingDTO> bookings = jdbcTemplate.query(
            adminBookingSql(schema) + whereClause + " ORDER BY b.booked_at DESC",
            bookingMapper(),
            roomId
        );
        hydrateBookingRooms(bookings, schema);
        return bookings;
    }

    public List<BookingDTO> searchBookings(String searchId, String guestName, String hotel, LocalDate startDate, LocalDate endDate) {
        BookingSchema schema = bookingSchema();
        StringBuilder sql = new StringBuilder(adminBookingSql(schema));
        List<String> filters = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        if (hasText(searchId)) {
            filters.add("CAST(b.id AS CHAR) LIKE ?");
            params.add("%" + searchId.trim().replace("B-", "").replace("b-", "") + "%");
        }

        if (hasText(guestName)) {
            filters.add("LOWER(" + guestNameExpression(schema) + ") LIKE ?");
            params.add("%" + guestName.trim().toLowerCase() + "%");
        }

        if (hasText(hotel)) {
            filters.add("LOWER(COALESCE(hb.address, '')) LIKE ?");
            params.add("%" + hotel.trim().toLowerCase() + "%");
        }

        if (startDate != null) {
            filters.add("b.check_in_date >= ?");
            params.add(startDate);
        }

        if (endDate != null) {
            filters.add("b.check_out_date <= ?");
            params.add(endDate);
        }

        if (!filters.isEmpty()) {
            sql.append(" WHERE ").append(String.join(" AND ", filters));
        }
        sql.append(" ORDER BY b.booked_at DESC, b.id DESC");

        List<BookingDTO> bookings = jdbcTemplate.query(sql.toString(), bookingMapper(), params.toArray());
        hydrateBookingRooms(bookings, schema);
        return bookings;
    }

    public List<BookingDTO> getBookingsByHotelBranchId(int hotelBranchId) {
        BookingSchema schema = bookingSchema();
        List<BookingDTO> bookings = jdbcTemplate.query(
            adminBookingSql(schema) + " WHERE b.hotel_branch_id = ? ORDER BY b.booked_at DESC, b.id DESC",
            bookingMapper(),
            hotelBranchId
        );
        hydrateBookingRooms(bookings, schema);
        return bookings;
    }

    public List<BookingDTO> searchBookingsByHotelBranchId(
            int hotelBranchId,
            String searchId,
            String guestName,
            LocalDate startDate,
            LocalDate endDate) {
        BookingSchema schema = bookingSchema();
        StringBuilder sql = new StringBuilder(adminBookingSql(schema));
        List<String> filters = new ArrayList<>();
        List<Object> params = new ArrayList<>();

        filters.add("b.hotel_branch_id = ?");
        params.add(hotelBranchId);

        if (hasText(searchId)) {
            filters.add("CAST(b.id AS CHAR) LIKE ?");
            params.add("%" + searchId.trim().replace("B-", "").replace("b-", "") + "%");
        }

        if (hasText(guestName)) {
            filters.add("LOWER(" + guestNameExpression(schema) + ") LIKE ?");
            params.add("%" + guestName.trim().toLowerCase() + "%");
        }

        if (startDate != null) {
            filters.add("b.check_in_date >= ?");
            params.add(startDate);
        }

        if (endDate != null) {
            filters.add("b.check_out_date <= ?");
            params.add(endDate);
        }

        sql.append(" WHERE ").append(String.join(" AND ", filters));
        sql.append(" ORDER BY b.booked_at DESC, b.id DESC");

        List<BookingDTO> bookings = jdbcTemplate.query(sql.toString(), bookingMapper(), params.toArray());
        hydrateBookingRooms(bookings, schema);
        return bookings;
    }

    // Kiem tra phong co trong
    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) {
        BookingSchema schema = bookingSchema();
        if (schema.hasBookingRoomTable()) {
            String sql = """
                SELECT COUNT(*)
                FROM booking_room br
                JOIN booking b ON br.booking_id = b.id
                WHERE br.room_id = ?
                  AND b.check_in_date < ?
                  AND b.check_out_date > ?
                """;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roomId, checkOut, checkIn);
            return count == null || count == 0;
        }

        if (schema.hasBookingRoomColumn()) {
            String sql = """
                SELECT COUNT(*)
                FROM booking b
                WHERE b.room_id = ?
                  AND b.check_in_date < ?
                  AND b.check_out_date > ?
                """;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roomId, checkOut, checkIn);
            return count == null || count == 0;
        }

        return true;
    }

    // Them booking moi (frontend)
    public int addBooking(BookingRequest request) {
        BookingSchema schema = bookingSchema();
        if (schema.hasBookingRoomTable() && schema.hasBookingPriceColumn() && schema.hasBookingUserColumn()) {
            return addModernBooking(request);
        }
        if (schema.hasBookingRoomColumn()) {
            return addLegacyBooking(request);
        }
        throw new IllegalStateException("Booking schema is missing both booking_room and booking.room_id");
    }

    private int addModernBooking(BookingRequest request) {
        Integer firstRoomId = firstRoomId(request);
        String roomImg = resolveRoomImage(firstRoomId);

        String sql = """
            INSERT INTO booking(check_in_date, check_out_date, room_img, hotel_branch_id, user_id, booking_price)
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(
            sql,
            request.getCheckInDate(),
            request.getCheckOutDate(),
            roomImg,
            request.getHotelBranchId(),
            request.getUserId(),
            request.getBookingPrice()
        );

        String findSql = "SELECT id FROM booking WHERE user_id = ? AND hotel_branch_id = ? " +
                        "AND check_in_date = ? AND check_out_date = ? ORDER BY id DESC LIMIT 1";

        Integer bookingId = jdbcTemplate.queryForObject(
            findSql,
            Integer.class,
            request.getUserId(),
            request.getHotelBranchId(),
            request.getCheckInDate(),
            request.getCheckOutDate()
        );

        String roomSql = "INSERT INTO booking_room(booking_id, room_id) VALUES (?, ?)";
        for (Integer roomId : request.getRoomIds()) {
            jdbcTemplate.update(roomSql, bookingId, roomId);
        }

        return bookingId;
    }

    private int addLegacyBooking(BookingRequest request) {
        Integer roomId = firstRoomId(request);
        String roomImg = resolveRoomImage(roomId);

        String sql = """
            INSERT INTO booking(check_in_date, check_out_date, room_img, hotel_branch_id, room_id)
            VALUES (?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(
            sql,
            request.getCheckInDate(),
            request.getCheckOutDate(),
            roomImg,
            request.getHotelBranchId(),
            roomId
        );

        return jdbcTemplate.queryForObject(
            """
            SELECT id
            FROM booking
            WHERE hotel_branch_id = ?
              AND room_id = ?
              AND check_in_date = ?
              AND check_out_date = ?
            ORDER BY id DESC
            LIMIT 1
            """,
            Integer.class,
            request.getHotelBranchId(),
            roomId,
            request.getCheckInDate(),
            request.getCheckOutDate()
        );
    }

    private Integer firstRoomId(BookingRequest request) {
        if (request.getRoomIds() == null || request.getRoomIds().isEmpty()) {
            throw new IllegalArgumentException("At least one room is required");
        }
        return request.getRoomIds().get(0);
    }

    private String resolveRoomImage(Integer roomId) {
        List<String> rows = jdbcTemplate.query(
            "SELECT room_img FROM room WHERE id = ? LIMIT 1",
            (rs, rowNum) -> rs.getString("room_img"),
            roomId
        );
        return rows.isEmpty() || rows.get(0) == null || rows.get(0).isBlank()
            ? "default-room.jpg"
            : rows.get(0);
    }

    // Lay tat ca booking theo userId (frontend)
    // public List<BookingDTO> getBookingsByUserId(int userId) {
    //     BookingSchema schema = bookingSchema();
    //     String userFilter = schema.hasBookingUserColumn()
    //         ? " WHERE b.user_id = ?"
    //         : " WHERE review_summary.CustomerID = ?";

    //     List<BookingDTO> bookings = jdbcTemplate.query(
    //         adminBookingSql(schema) + userFilter + " ORDER BY b.booked_at DESC, b.id DESC",
    //         bookingMapper(),
    //         userId
    //     );

    //     hydrateBookingRooms(bookings, schema);

    //     return bookings;
    // }

    // SQL cho admin panel
    private String adminBookingSql() {
        return adminBookingSql(bookingSchema());
    }

    private String adminBookingSql(BookingSchema schema) {
        String userIdExpression = schema.hasBookingUserColumn() ? "b.user_id" : "review_summary.CustomerID";
        String bookingPriceExpression = schema.hasBookingPriceColumn() ? "b.booking_price" : "NULL";
        String reviewedExpression = schema.hasBookingReviewedColumn() ? "b.reviewed" : "FALSE";
        String bookingUserJoin = schema.hasBookingUserColumn()
            ? "LEFT JOIN users booking_user ON booking_user.id = b.user_id"
            : "";
        String guestNameExpression = guestNameExpression(schema);
        String guestEmailExpression = schema.hasBookingUserColumn()
            ? "COALESCE(booking_user.email, review_user.email)"
            : "review_user.email";

        String roomIdExpression = "NULL";
        String roomTypeExpression = "NULL";
        String nightlyPriceExpression = "0";
        String roomJoins = "";

        if (schema.hasBookingRoomTable()) {
            roomIdExpression = "room_summary.room_id";
            roomTypeExpression = "room_summary.room_type";
            nightlyPriceExpression = "COALESCE(room_summary.nightly_price, 0)";
            roomJoins = """
                LEFT JOIN (
                    SELECT br.booking_id,
                           MIN(r.id) AS room_id,
                           SUM(COALESCE(r.price, 0)) AS nightly_price,
                           GROUP_CONCAT(DISTINCT tr.code ORDER BY tr.code SEPARATOR ', ') AS room_type
                    FROM booking_room br
                    LEFT JOIN room r ON br.room_id = r.id
                    LEFT JOIN typeroom tr ON r.type_room_id = tr.id
                    GROUP BY br.booking_id
                ) room_summary ON room_summary.booking_id = b.id
                """;
        } else if (schema.hasBookingRoomColumn()) {
            roomIdExpression = "b.room_id";
            roomTypeExpression = "tr.code";
            nightlyPriceExpression = "COALESCE(r.price, 0)";
            roomJoins = """
                LEFT JOIN room r ON b.room_id = r.id
                LEFT JOIN typeroom tr ON r.type_room_id = tr.id
                """;
        }

        return """
            SELECT b.id,
                   b.check_in_date,
                   b.check_out_date,
                   b.booked_at,
                   b.hotel_branch_id,
                   %s AS user_id,
                   %s AS booking_price,
                   %s AS reviewed,
                   %s AS nightly_price,
                   hb.address AS hotel_name,
                   receipt_summary.amount AS paid_amount,
                   %s AS guest_name,
                   %s AS guest_email,
                   checkout_summary.checkout_id AS checkout_id,
                   %s AS room_id,
                   %s AS room_type
            FROM booking b
            LEFT JOIN hotelbranch hb ON b.hotel_branch_id = hb.id
            %s
            LEFT JOIN (
                SELECT BookingID, SUM(amount) AS amount
                FROM receipt
                GROUP BY BookingID
            ) receipt_summary ON receipt_summary.BookingID = b.id
            LEFT JOIN (
                SELECT BookingID, MIN(CustomerID) AS CustomerID
                FROM review
                GROUP BY BookingID
            ) review_summary ON review_summary.BookingID = b.id
            LEFT JOIN users review_user ON review_user.id = review_summary.CustomerID
            %s
            LEFT JOIN (
                SELECT BookingID, MAX(id) AS checkout_id
                FROM checkout
                GROUP BY BookingID
            ) checkout_summary ON checkout_summary.BookingID = b.id
            """.formatted(
                userIdExpression,
                bookingPriceExpression,
                reviewedExpression,
                nightlyPriceExpression,
                guestNameExpression,
                guestEmailExpression,
                roomIdExpression,
                roomTypeExpression,
                roomJoins,
                bookingUserJoin
            );
    }

    private String guestNameExpression(BookingSchema schema) {
        return schema.hasBookingUserColumn()
            ? "COALESCE(booking_user.full_name, review_user.full_name, '')"
            : "COALESCE(review_user.full_name, '')";
    }

    private void hydrateBookingRooms(List<BookingDTO> bookings, BookingSchema schema) {
        for (BookingDTO booking : bookings) {
            booking.setBookingRooms(loadBookingRooms(booking, schema));
        }
    }

    // Mapper cho BookingDTO
    private RowMapper<BookingDTO> bookingMapper() {
        return (rs, rowNum) -> {
            LocalDate checkInDate = rs.getDate("check_in_date").toLocalDate();
            LocalDate checkOutDate = rs.getDate("check_out_date").toLocalDate();
            LocalDateTime bookedAt = rs.getTimestamp("booked_at").toLocalDateTime();
            int rawId = rs.getInt("id");

            Long storedBookingPrice = rs.getObject("booking_price") != null ? rs.getLong("booking_price") : null;
            Long nightlyPrice = rs.getObject("nightly_price") != null ? rs.getLong("nightly_price") : null;
            long nights = Math.max(1, ChronoUnit.DAYS.between(checkInDate, checkOutDate));
            Long totalPrice = storedBookingPrice != null
                ? storedBookingPrice
                : nightlyPrice == null ? null : nightlyPrice * nights;
            Long pricePerNight = nightlyPrice != null && nightlyPrice > 0
                ? nightlyPrice
                : totalPrice == null ? null : totalPrice / nights;
            Long paidAmount = rs.getObject("paid_amount") != null ? rs.getLong("paid_amount") : null;

            BookingDTO booking = new BookingDTO(
                rawId,
                checkInDate,
                checkOutDate,
                bookedAt,
                totalPrice,
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getBoolean("reviewed"),
                List.of()
            );

            booking.setRoomId(rs.getObject("room_id") != null ? rs.getInt("room_id") : null);
            booking.setRoomType(rs.getString("room_type"));
            booking.setGuestName(valueOrDefault(rs.getString("guest_name"), "Guest #" + rawId));
            booking.setGuestEmail(rs.getString("guest_email"));
            booking.setHotelName(valueOrDefault(rs.getString("hotel_name"), "Unknown hotel"));
            booking.setNumberOfNights((int) nights);
            booking.setPricePerNight(pricePerNight);
            booking.setTotalPrice(totalPrice);
            booking.setPaymentStatus(resolvePaymentStatus(paidAmount, totalPrice));
            booking.setBookingStatus(resolveBookingStatus(checkInDate, checkOutDate, rs.getObject("checkout_id") != null));

            return booking;
        };
    }

    private List<BookingRoomDTO> loadBookingRooms(BookingDTO booking, BookingSchema schema) {
        if (schema.hasBookingRoomTable()) {
            String roomSql = """
                SELECT br.id AS booking_room_id,
                       br.booking_id,
                       r.id AS room_id,
                       r.room_number,
                       r.room_img,
                       tr.name AS room_type,
                       r.price
                FROM booking_room br
                JOIN room r ON br.room_id = r.id
                JOIN typeroom tr ON r.type_room_id = tr.id
                WHERE br.booking_id = ?
                """;

            return jdbcTemplate.query(
                roomSql,
                (rs, rowNum) -> new BookingRoomDTO(
                    rs.getInt("booking_room_id"),
                    rs.getInt("booking_id"),
                    rs.getInt("room_id"),
                    rs.getString("room_number"),
                    rs.getString("room_img"),
                    rs.getString("room_type"),
                    rs.getLong("price")
                ),
                booking.getBookingId()
            );
        }

        if (schema.hasBookingRoomColumn() && booking.getRoomId() != null) {
            String roomSql = """
                SELECT b.id AS booking_room_id,
                       b.id AS booking_id,
                       r.id AS room_id,
                       r.room_number,
                       r.room_img,
                       tr.name AS room_type,
                       r.price
                FROM booking b
                JOIN room r ON b.room_id = r.id
                JOIN typeroom tr ON r.type_room_id = tr.id
                WHERE b.id = ?
                """;

            return jdbcTemplate.query(
                roomSql,
                (rs, rowNum) -> new BookingRoomDTO(
                    rs.getInt("booking_room_id"),
                    rs.getInt("booking_id"),
                    rs.getInt("room_id"),
                    rs.getString("room_number"),
                    rs.getString("room_img"),
                    rs.getString("room_type"),
                    rs.getLong("price")
                ),
                booking.getBookingId()
            );
        }

        return List.of();
    }

    private String resolvePaymentStatus(Long paidAmount, Long totalPrice) {
        if (paidAmount == null || paidAmount <= 0) return "Pending";
        if (totalPrice == null || totalPrice <= 0 || paidAmount >= totalPrice) return "Paid";
        return "Partial";
    }

    private String resolveBookingStatus(LocalDate checkInDate, LocalDate checkOutDate, boolean hasCheckout) {
        LocalDate today = LocalDate.now();
        if (hasCheckout || checkOutDate.isBefore(today)) return "Completed";
        if (checkInDate.isAfter(today)) return "Confirmed";
        return "Confirmed";
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
    // Lấy booking theo UserID (frontend)
    public List<BookingDTO> getBookingsByUserId(int userId) {
        String sql = "SELECT id, check_in_date, check_out_date, booked_at, " +
                    "hotel_branch_id, user_id, booking_price, reviewed " +
                    "FROM booking WHERE user_id = ?";        
        List<BookingDTO> bookings = jdbcTemplate.query(sql,
                (rs, rowNum) -> new BookingDTO(
                    rs.getInt("id"),
                    rs.getDate("check_in_date").toLocalDate(),
                    rs.getDate("check_out_date").toLocalDate(),
                    rs.getTimestamp("booked_at").toLocalDateTime(),
                    rs.getLong("booking_price"),
                    rs.getInt("user_id"),
                    rs.getInt("hotel_branch_id"),
                    rs.getBoolean("reviewed"),
                    List.of()
                ),
                userId
            );

        // Với mỗi booking, lấy danh sách phòng
        for (BookingDTO booking : bookings) {
            String roomSql = "SELECT br.id AS booking_room_id, br.booking_id, r.id AS room_id, " +
                            "r.room_number, r.room_img, tr.name AS room_type, r.price " +
                            "FROM booking_room br " +
                            "JOIN room r ON br.room_id = r.id " +
                            "JOIN typeroom tr ON r.type_room_id = tr.id " +
                            "WHERE br.booking_id = ?";

            List<BookingRoomDTO> bookingRooms = jdbcTemplate.query(
                roomSql,
                (rs, rowNum) -> new BookingRoomDTO(
                    rs.getInt("booking_room_id"),
                    rs.getInt("booking_id"),
                    rs.getInt("room_id"),
                    rs.getString("room_number"),
                    rs.getString("room_img"),
                    rs.getString("room_type"),
                    rs.getLong("price")
                ),
                booking.getBookingId()
            );

            booking.setBookingRooms(bookingRooms);
        }
        return bookings;
    }
    private BookingSchema bookingSchema() {
        return new BookingSchema(
            schemaInspector.tableExists("booking_room"),
            schemaInspector.columnExists("booking", "booking_price"),
            schemaInspector.columnExists("booking", "user_id"),
            schemaInspector.columnExists("booking", "room_id"),
            schemaInspector.columnExists("booking", "reviewed")
        );
    }
    public void markBookingReviewed(int bookingId) {
        String sql = "UPDATE booking SET reviewed = TRUE WHERE id = ?";
        jdbcTemplate.update(sql, bookingId);
    }

    private record BookingSchema(
        boolean hasBookingRoomTable,
        boolean hasBookingPriceColumn,
        boolean hasBookingUserColumn,
        boolean hasBookingRoomColumn,
        boolean hasBookingReviewedColumn
    ) {}
}
