package com.hotel.booking.repository;

import com.hotel.booking.dto.BookingDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {
    private final JdbcTemplate jdbcTemplate;

    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BookingDTO> getAllBookings() {
        return jdbcTemplate.query(adminBookingSql() + " ORDER BY b.booked_at DESC, b.id DESC", bookingMapper());
    }

    public Optional<BookingDTO> getBookingById(int id) {
        List<BookingDTO> rows = jdbcTemplate.query(
            adminBookingSql() + " WHERE b.id = ?",
            bookingMapper(),
            id
        );
        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    public List<BookingDTO> getBookingsByRoomID(int roomId) {
        return jdbcTemplate.query(
            adminBookingSql() + " WHERE b.room_id = ? ORDER BY b.booked_at DESC",
            bookingMapper(),
            roomId
        );
    }

    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) {
        String sql = """
            SELECT COUNT(*)
            FROM booking
            WHERE room_id = ?
              AND (check_in_date < ? AND check_out_date > ?)
            """;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, roomId, checkOut, checkIn);
        return count == null || count == 0;
    }

    public void addBooking(BookingDTO booking) {
        String sql = """
            INSERT INTO booking(check_in_date, check_out_date, room_img, hotel_branch_id, room_id)
            VALUES (?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(
            sql,
            booking.getCheckInDate(),
            booking.getCheckOutDate(),
            booking.getRoomIMG(),
            booking.getHotelBranchID(),
            booking.getRoomID()
        );
    }

    private String adminBookingSql() {
        return """
            SELECT b.id,
                   b.check_in_date,
                   b.check_out_date,
                   b.booked_at,
                   b.room_img,
                   b.hotel_branch_id,
                   b.room_id,
                   hb.address AS hotel_name,
                   tr.name AS room_type,
                   r.price AS price_per_night,
                   receipt_summary.amount AS paid_amount,
                   review_user.full_name AS guest_name,
                   review_user.email AS guest_email,
                   checkout_summary.checkout_id AS checkout_id
            FROM booking b
            LEFT JOIN hotelbranch hb ON b.hotel_branch_id = hb.id
            LEFT JOIN room r ON b.room_id = r.id
            LEFT JOIN typeroom tr ON r.type_room_id = tr.id
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
                rs.getString("room_img"),
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getObject("room_id") != null ? rs.getInt("room_id") : null
            );

            Long pricePerNight = rs.getObject("price_per_night") != null ? rs.getLong("price_per_night") : 0L;
            long nights = Math.max(1, ChronoUnit.DAYS.between(checkInDate, checkOutDate));
            long totalPrice = pricePerNight * nights;
            Long paidAmount = rs.getObject("paid_amount") != null ? rs.getLong("paid_amount") : null;

            booking.setGuestName(valueOrDefault(rs.getString("guest_name"), "Guest #" + rawId));
            booking.setGuestEmail(rs.getString("guest_email"));
            booking.setHotelName(valueOrDefault(rs.getString("hotel_name"), "Unknown hotel"));
            booking.setRoomType(valueOrDefault(rs.getString("room_type"), "Unknown room"));
            booking.setNumberOfNights((int) nights);
            booking.setPricePerNight(pricePerNight);
            booking.setTotalPrice(totalPrice);
            booking.setPaymentStatus(resolvePaymentStatus(paidAmount, totalPrice));
            booking.setBookingStatus(resolveBookingStatus(checkInDate, checkOutDate, rs.getObject("checkout_id") != null));

            return booking;
        };
    }

    private String resolvePaymentStatus(Long paidAmount, Long totalPrice) {
        if (paidAmount == null || paidAmount <= 0) {
            return "Pending";
        }
        if (totalPrice == null || totalPrice <= 0 || paidAmount >= totalPrice) {
            return "Paid";
        }
        return "Partial";
    }

    private String resolveBookingStatus(LocalDate checkInDate, LocalDate checkOutDate, boolean hasCheckout) {
        LocalDate today = LocalDate.now();
        if (hasCheckout || checkOutDate.isBefore(today)) {
            return "Completed";
        }
        if (checkInDate.isAfter(today)) {
            return "Confirmed";
        }
        return "Confirmed";
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
