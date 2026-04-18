package com.hotel.booking.repository;

import com.hotel.booking.dto.BookingDTO;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookingRepository {
    private Connection connection;

    public BookingRepository(Connection connection) {
        this.connection = connection;
    }

    // Lấy tất cả booking
    public List<BookingDTO> getAllBookings() throws SQLException {
        List<BookingDTO> bookings = new ArrayList<>();
        String sql = "SELECT * FROM Booking";

        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                bookings.add(mapResultSetToBooking(rs));
            }
        }
        return bookings;
    }

    // Lấy booking theo RoomID
    public List<BookingDTO> getBookingsByRoom(int roomId) throws SQLException {
        List<BookingDTO> bookings = new ArrayList<>();
        String sql = "SELECT * FROM Booking WHERE RoomID = ?";

        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, roomId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    bookings.add(mapResultSetToBooking(rs));
                }
            }
        }
        return bookings;
    }

    // Kiểm tra phòng có trống trong khoảng thời gian yêu cầu không
    public boolean isRoomAvailable(int roomId, LocalDate checkIn, LocalDate checkOut) throws SQLException {
        String sql = "SELECT COUNT(*) FROM Booking " +
                     "WHERE RoomID = ? AND ( " +
                     "      (checkInDate <= ? AND checkOutDate >= ?) " + // giao nhau với ngày check-in
                     "   OR (checkInDate <= ? AND checkOutDate >= ?) " + // giao nhau với ngày check-out
                     "   OR (checkInDate >= ? AND checkOutDate <= ?) " +  // nằm hoàn toàn trong khoảng
                     ")";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, roomId);
            pstmt.setDate(2, Date.valueOf(checkIn));
            pstmt.setDate(3, Date.valueOf(checkIn));
            pstmt.setDate(4, Date.valueOf(checkOut));
            pstmt.setDate(5, Date.valueOf(checkOut));
            pstmt.setDate(6, Date.valueOf(checkIn));
            pstmt.setDate(7, Date.valueOf(checkOut));

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) == 0; // nếu không có bản ghi trùng thì phòng trống
                }
            }
        }
        return true;
    }

    // Thêm booking mới
    public void addBooking(BookingDTO booking) throws SQLException {
        String sql = "INSERT INTO Booking(checkInDate, checkOutDate, roomIMG, HotelBranchID, RoomID) " +
                     "VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setDate(1, Date.valueOf(booking.getCheckInDate()));
            pstmt.setDate(2, Date.valueOf(booking.getCheckOutDate()));
            pstmt.setString(3, booking.getRoomIMG());
            pstmt.setObject(4, booking.getHotelBranchID());
            pstmt.setObject(5, booking.getRoomID());
            pstmt.executeUpdate();
        }
    }

    // Hàm tiện ích ánh xạ ResultSet -> BookingDTO
    private BookingDTO mapResultSetToBooking(ResultSet rs) throws SQLException {
        return new BookingDTO(
            rs.getInt("id"),
            rs.getDate("checkInDate").toLocalDate(),
            rs.getDate("checkOutDate").toLocalDate(),
            rs.getTimestamp("bookedAt").toLocalDateTime(),
            rs.getString("roomIMG"),
            rs.getObject("HotelBranchID") != null ? rs.getInt("HotelBranchID") : null,
            rs.getObject("RoomID") != null ? rs.getInt("RoomID") : null
        );
    }
}
