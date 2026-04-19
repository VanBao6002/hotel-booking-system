package com.hotel.booking.repository;

import com.hotel.booking.dto.BookingDTO;
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
                rs.getObject("room_id") != null ? rs.getInt("room_id") : null
            )
        );
    }

    // Lấy booking theo RoomID
    public List<BookingDTO> getBookingsByRoom(int roomId) {
        String sql = "SELECT * FROM booking WHERE room_id = ?";
        return jdbcTemplate.query(sql, new Object[]{roomId}, (rs, rowNum) ->
            new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getString("room_img"),
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                rs.getObject("room_id") != null ? rs.getInt("room_id") : null
            )
        );
    }

    // Kiểm tra phòng có trống
    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) {
        String sql = "SELECT COUNT(*) FROM booking WHERE room_id = ? " +
                     "AND (check_in_date < ? AND check_out_date > ?)";
        Integer count = jdbcTemplate.queryForObject(sql,
                new Object[]{roomId, checkOut, checkIn}, Integer.class);
        return count == null || count == 0;
    }

    // Thêm booking mới
    public void addBooking(BookingDTO booking) {
        String sql = "INSERT INTO booking(check_in_date, check_out_date, room_img, hotel_branch_id, room_id) " +
                     "VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getRoomIMG(),
                booking.getHotelBranchID(),
                booking.getRoomID()
        );
    }
}
