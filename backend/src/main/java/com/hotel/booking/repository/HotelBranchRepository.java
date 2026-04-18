package com.hotel.booking.repository;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HotelBranchRepository {
    private Connection connection;

    public HotelBranchRepository(Connection connection) {
        this.connection = connection;
    }

    // Lấy tất cả chi nhánh
    public List<HotelBranchDTO> getAllBranches() throws SQLException {
        List<HotelBranchDTO> branches = new ArrayList<>();
        String sql = "SELECT * FROM HotelBranch";

        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                HotelBranchDTO branch = new HotelBranchDTO(
                    rs.getInt("id"),
                    rs.getString("address"),
                    rs.getString("phone_number"),
                    null // chưa load danh sách phòng
                );
                branches.add(branch);
            }
        }
        return branches;
    }

    // Lấy chi nhánh theo ID (kèm danh sách phòng)
    public HotelBranchDTO getBranchById(int id) throws SQLException {
        String sqlBranch = "SELECT * FROM HotelBranch WHERE id = ?";
        HotelBranchDTO branch = null;

        try (PreparedStatement pstmt = connection.prepareStatement(sqlBranch)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    branch = new HotelBranchDTO(
                        rs.getInt("id"),
                        rs.getString("address"),
                        rs.getString("phone_number"),
                        new ArrayList<>()
                    );
                }
            }
        }

        // Nếu tìm thấy chi nhánh thì load danh sách phòng
        if (branch != null) {
            String sqlRooms = "SELECT * FROM Room WHERE HotelBranchID = ?";
            try (PreparedStatement pstmt = connection.prepareStatement(sqlRooms)) {
                pstmt.setInt(1, id);
                try (ResultSet rs = pstmt.executeQuery()) {
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
                        branch.getRooms().add(room);
                    }
                }
            }
        }

        return branch;
    }

    // Thêm chi nhánh mới
    public void addBranch(HotelBranchDTO branch) throws SQLException {
        String sql = "INSERT INTO HotelBranch(address, phone_number) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, branch.getAddress());
            pstmt.setString(2, branch.getPhoneNumber());
            pstmt.executeUpdate();
        }
    }
}
