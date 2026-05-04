package com.hotel.booking.repository;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.BookingRequest;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class BookingRepository {
    private final JdbcTemplate jdbcTemplate;

    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả booking
    public List<BookingDTO> getAllBookings() {
        String sql = "SELECT * FROM booking";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getString("room_img"),
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getObject("room_id") != null ? rs.getInt("room_id") : null,
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,          // thêm user_id
                rs.getLong("booking_price")                                           // thêm booking_price
            )
        );
    }


    // Lấy booking theo RoomID
    public List<BookingDTO> getBookingsByRoomID(int roomId) {
        String sql = "SELECT * FROM booking WHERE room_id = ?";

        return jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getString("room_img"),
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getObject("room_id") != null ? rs.getInt("room_id") : null,
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,   // thêm userId
                rs.getLong("booking_price")                                     // thêm bookingPrice
            ),
            roomId // truyền trực tiếp varargs thay vì new Object[]{roomId}
        );
    }



    // Kiểm tra phòng có trống
    public boolean isRoomBooked(int roomId, LocalDate checkIn, LocalDate checkOut) {
        String sql = "SELECT COUNT(*) FROM booking WHERE room_id = ? " +
                    "AND (check_in_date < ? AND check_out_date > ?)";

        Integer count = jdbcTemplate.queryForObject(
            sql,
            Integer.class,
            roomId,   // truyền trực tiếp varargs
            checkOut,
            checkIn
        );

        return count == null || count == 0;
    }


    // Thêm booking mới
    public int addBooking(BookingRequest request) {
        String sql = "INSERT INTO booking(check_in_date, check_out_date, room_img, " +
                     "hotel_branch_id, room_id, user_id, booking_price) VALUES (?, ?, ?, ?, ?, ?, ?)";

        return jdbcTemplate.update(sql,
            request.getCheckInDate(),
            request.getCheckOutDate(),
            request.getRoomImg(),
            request.getHotelBranchId(),
            request.getRoomId(),
            request.getUserId(),
            request.getBookingPrice()
        );
    }
        ///// show bookings
    public List<BookingDTO> getBookingsByUserId(int userId) {
        String sql = "SELECT * FROM booking WHERE user_id = ?";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getString("room_img"),
                rs.getInt("hotel_branch_id"),
                rs.getInt("room_id"),
                rs.getInt("user_id"),
                rs.getLong("booking_price")
        ), userId); // truyền trực tiếp varargs
    }


}
