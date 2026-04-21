package com.hotel.booking.repository;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HotelBranchRepository {
    private final JdbcTemplate jdbcTemplate;

    public HotelBranchRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả chi nhánh
    public List<HotelBranchDTO> getAllBranches() {
        String sql = "SELECT id, address, phone_number FROM hotelbranch";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new HotelBranchDTO(
                rs.getInt("id"),
                rs.getString("address"),
                rs.getString("phone_number"),
                null
            )
        );
    }

    // Lấy chi nhánh theo ID (kèm danh sách phòng)
    public HotelBranchDTO getBranchById(int id) {
        String sqlBranch = "SELECT id, address, phone_number FROM hotelbranch WHERE id = ?";
        HotelBranchDTO branch = jdbcTemplate.queryForObject(sqlBranch, new Object[]{id}, (rs, rowNum) ->
            new HotelBranchDTO(
                rs.getInt("id"),
                rs.getString("address"),
                rs.getString("phone_number"),
                List.of()
            )
        );

        // load rooms
        String sqlRooms = "SELECT r.id, r.area, r.number_of_bed, r.description, r.room_img, " +
                 "r.hotel_branch_id, r.type_room_id, r.location_id, r.room_status_id, " +
                 "tr.code AS type_code " +
                 "FROM room r " +
                 "JOIN typeroom tr ON r.type_room_id = tr.id " +
                 "WHERE r.hotel_branch_id = ?";
        List<RoomDTO> rooms = jdbcTemplate.query(sqlRooms, new Object[]{id}, (rs, rowNum) ->
            new RoomDTO(
            rs.getInt("id"),
            rs.getString("area"),
            rs.getInt("number_of_bed"),
            rs.getString("description"),
            rs.getString("room_img"),
            rs.getInt("hotel_branch_id"),
            rs.getInt("type_room_id"),
            rs.getInt("location_id"),
            rs.getInt("room_status_id"),
            rs.getString("type_code") // thêm field này vào DTO
        )
        );
        branch.setRooms(rooms);

        return branch;
    }

    // Thêm chi nhánh mới
    public void addBranch(HotelBranchDTO branch) {
        String sql = "INSERT INTO hotelbranch(address, phone_number) VALUES (?, ?)";
        jdbcTemplate.update(sql, branch.getAddress(), branch.getPhoneNumber());
    }
}
