package com.hotel.booking.repository;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.BookingRoomDTO;

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

    public List<BookingDTO> getAllBookings() {
        String sql = "SELECT * FROM booking";
        List<BookingDTO> bookings = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getLong("booking_price"),
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                null // danh sách phòng sẽ set sau
            )
        );

        for (BookingDTO booking : bookings) {
            String roomSql = "SELECT br.id AS booking_room_id, br.booking_id, r.id AS room_id, " +
                            "r.room_number, r.room_img, r.room_type, r.price " +
                            "FROM booking_room br " +
                            "JOIN room r ON br.room_id = r.id " +
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
                booking.getId() // truyền args ở cuối, đúng chuẩn mới
            );

            booking.setBookingRooms(bookingRooms);
        }

        return bookings;
    }




    // // Lấy booking theo RoomID
    // public List<BookingDTO> getBookingsByRoomID(int roomId) {
    //     String sql = "SELECT * FROM booking WHERE room_id = ?";

    //     return jdbcTemplate.query(
    //         sql,
    //         (rs, rowNum) -> new BookingDTO(
    //             rs.getInt("id"),
    //             rs.getDate("check_in_date").toLocalDate(),
    //             rs.getDate("check_out_date").toLocalDate(),
    //             rs.getTimestamp("booked_at").toLocalDateTime(),
    //             rs.getString("room_img"),
    //             rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
    //             rs.getObject("room_id") != null ? rs.getInt("room_id") : null,
    //             rs.getObject("user_id") != null ? rs.getInt("user_id") : null,   // thêm userId
    //             rs.getLong("booking_price")                                     // thêm bookingPrice
    //         ),
    //         roomId // truyền trực tiếp varargs thay vì new Object[]{roomId}
    //     );
    // }



    // Kiểm tra phòng có trống trong khoảng ngày
    public boolean isRoomBooked(int roomId, LocalDate checkIn, LocalDate checkOut) {
        String sql = "SELECT COUNT(*) " +
                    "FROM booking b " +
                    "JOIN booking_room br ON b.id = br.booking_id " +
                    "WHERE br.room_id = ? " +
                    "AND (b.check_in_date < ? AND b.check_out_date > ?)";

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
        // 1. Insert booking
        String bookingSql = "INSERT INTO booking(check_in_date, check_out_date, hotel_branch_id, user_id, booking_price) " +
                            "VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(
            bookingSql,
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
    public List<BookingDTO> getBookingsByUserId(int userId) {
        String sql = "SELECT * FROM booking WHERE user_id = ?";
        List<BookingDTO> bookings = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new BookingDTO(
                rs.getInt("id"),
                rs.getDate("check_in_date").toLocalDate(),
                rs.getDate("check_out_date").toLocalDate(),
                rs.getTimestamp("booked_at").toLocalDateTime(),
                rs.getLong("booking_price"),
                rs.getObject("user_id") != null ? rs.getInt("user_id") : null,
                rs.getObject("hotel_branch_id") != null ? rs.getInt("hotel_branch_id") : null,
                null // danh sách phòng sẽ set sau
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
                    rs.getString("room_type"), // lấy từ typeroom.name
                    rs.getLong("price")
                ),
                booking.getId()
            );

            booking.setBookingRooms(bookingRooms);
        }

        return bookings;
    }



}
