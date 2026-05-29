package com.hotel.booking.repository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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

    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả booking cho admin
    public List<BookingDTO> getAllBookings() {
        return jdbcTemplate.query(adminBookingSql() + " ORDER BY b.booked_at DESC, b.id DESC", bookingMapper());
    }

    // Lấy booking theo ID
    public Optional<BookingDTO> getBookingById(int id) {
        List<BookingDTO> rows = jdbcTemplate.query(
            adminBookingSql() + " WHERE b.id = ?",
            bookingMapper(),
            id
        );
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    // Lấy booking theo RoomID
    public List<BookingDTO> getBookingsByRoomID(int roomId) {
        return jdbcTemplate.query(
            adminBookingSql() + " WHERE b.room_id = ? ORDER BY b.booked_at DESC",
            bookingMapper(),
            roomId
        );
    }

    // Kiểm tra phòng có trống
    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) {
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

    // Thêm booking mới (frontend)
    public int addBooking(BookingRequest request) {
        String sql = """
            INSERT INTO booking(check_in_date, check_out_date, hotel_branch_id, user_id, booking_price)
            VALUES (?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(
            sql,
            request.getCheckInDate(),
            request.getCheckOutDate(),
            request.getHotelBranchId(),
            request.getUserId(),
            request.getBookingPrice()
        );

        // 2. Lấy id booking vừa tạo (dựa vào điều kiện duy nhất: user + branch + ngày)
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

        // 3. Insert danh sách phòng vào booking_room
        String roomSql = "INSERT INTO booking_room(booking_id, room_id) VALUES (?, ?)";
        for (Integer roomId : request.getRoomIds()) {
            jdbcTemplate.update(roomSql, bookingId, roomId);
        }

        return bookingId;
    }

    // Lấy tất cả booking theo userId
    // SQL cho admin panel
    private String adminBookingSql() {
        return """
            SELECT b.id,
                   b.check_in_date,
                   b.check_out_date,
                   b.booked_at,
                   b.hotel_branch_id,
                   b.user_id,
                   b.booking_price,
                   hb.address AS hotel_name,
                   receipt_summary.amount AS paid_amount,
                   review_user.full_name AS guest_name,
                   review_user.email AS guest_email,
                   checkout_summary.checkout_id AS checkout_id
            FROM booking b
            LEFT JOIN hotelbranch hb ON b.hotel_branch_id = hb.id
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
            LEFT JOIN (
                SELECT BookingID, MAX(id) AS checkout_id
                FROM checkout
                GROUP BY BookingID
            ) checkout_summary ON checkout_summary.BookingID = b.id
            """;
    }

    // Mapper cho BookingDTO
    private RowMapper<BookingDTO> bookingMapper() {
        return (rs, rowNum) -> {
            LocalDate checkInDate = rs.getDate("check_in_date").toLocalDate();
            LocalDate checkOutDate = rs.getDate("check_out_date").toLocalDate();
            int rawId = rs.getInt("id");

            BookingDTO booking = new BookingDTO(
                rawId,
                checkInDate,
                checkOutDate,
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getObject("booking_price") != null ? rs.getLong("booking_price") : null,
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getBoolean("reviewed"),
                List.of()
            );

            long nights = Math.max(1, ChronoUnit.DAYS.between(checkInDate, checkOutDate));
            Long bookingPrice = rs.getObject("booking_price") != null ? rs.getLong("booking_price") : null;
            Long pricePerNight = bookingPrice != null ? bookingPrice / nights : null;
            Long totalPrice = bookingPrice;
            Long paidAmount = rs.getObject("paid_amount") != null ? rs.getLong("paid_amount") : null;

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

    // Lấy booking theo UserID (frontend)
    public List<BookingDTO> getBookingsByUserId(int userId) {
    String sql = "SELECT id, check_in_date, check_out_date, booked_at, " +
                 "hotel_branch_id, user_id, booking_price, reviewed " +
                 "FROM booking WHERE user_id = ?";        List<BookingDTO> bookings = jdbcTemplate.query(
            sql,
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
    public void markBookingReviewed(int bookingId) {
        String sql = "UPDATE booking SET reviewed = TRUE WHERE id = ?";
        jdbcTemplate.update(sql, bookingId);
    }

}
