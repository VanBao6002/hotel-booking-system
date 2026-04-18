package com.hotel.booking.repository;

import com.hotel.booking.dto.RoomDTO;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoomRepository {
    private Connection connection;

    public RoomRepository(Connection connection) {
        this.connection = connection;
    }

    // Lấy tất cả phòng
    public List<RoomDTO> getAllRooms() throws SQLException {
        List<RoomDTO> rooms = new ArrayList<>();
        String sql = "SELECT * FROM Room";

        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                RoomDTO room = new RoomDTO(
                    rs.getInt("id"),
                    rs.getString("area"),
                    rs.getInt("numberOfBed"),
                    rs.getString("description"),
                    rs.getString("roomIMG"),
                    rs.getInt("HotelBranchID"),
                    rs.getInt("TypeRoomID"),
                    rs.getInt("LocationID"),
                    rs.getInt("RoomStatusID")
                );
                rooms.add(room);
            }
        }
        return rooms;
    }

    // Lấy phòng theo ID
    public RoomDTO getRoomById(int id) throws SQLException {
        String sql = "SELECT * FROM Room WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new RoomDTO(
                        rs.getInt("id"),
                        rs.getString("area"),
                        rs.getInt("numberOfBed"),
                        rs.getString("description"),
                        rs.getString("roomIMG"),
                        rs.getInt("HotelBranchID"),
                        rs.getInt("TypeRoomID"),
                        rs.getInt("LocationID"),
                        rs.getInt("RoomStatusID")
                    );
                }
            }
        }
        return null;
    }

    // Thêm phòng mới
    public void addRoom(RoomDTO room) throws SQLException {
        String sql = "INSERT INTO Room(area, numberOfBed, description, roomIMG, HotelBranchID, TypeRoomID, LocationID, RoomStatusID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, room.getArea());
            pstmt.setInt(2, room.getNumberOfBed());
            pstmt.setString(3, room.getDescription());
            pstmt.setString(4, room.getRoomIMG());
            pstmt.setObject(5, room.getHotelBranchID());
            pstmt.setObject(6, room.getTypeRoomID());
            pstmt.setObject(7, room.getLocationID());
            pstmt.setObject(8, room.getRoomStatusID());
            pstmt.executeUpdate();
        }
    }
}
