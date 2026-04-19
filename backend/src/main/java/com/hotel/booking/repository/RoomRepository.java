package com.hotel.booking.repository;

import com.hotel.booking.dto.RoomDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoomRepository {
    private final JdbcTemplate jdbcTemplate;

    public RoomRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả phòng
    public List<RoomDTO> getAllRooms() {
        String sql = "SELECT * FROM room";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new RoomDTO(
                rs.getInt("id"),
                rs.getString("area"),
                rs.getInt("number_of_bed"),
                rs.getString("description"),
                rs.getString("room_img"),
                rs.getInt("hotel_branch_id"),
                rs.getInt("type_room_id"),
                rs.getInt("location_id"),
                rs.getInt("room_status_id")
            )
        );
    }

    // Lấy phòng theo ID
    public RoomDTO getRoomById(int id) {
        String sql = "SELECT * FROM room WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) ->
            new RoomDTO(
                rs.getInt("id"),
                rs.getString("area"),
                rs.getInt("number_of_bed"),
                rs.getString("description"),
                rs.getString("room_img"),
                rs.getInt("hotel_branch_id"),
                rs.getInt("type_room_id"),
                rs.getInt("location_id"),
                rs.getInt("room_status_id")
            )
        );
    }

    // Thêm phòng mới
    public void addRoom(RoomDTO room) {
        String sql = "INSERT INTO room(area, number_of_bed, description, room_img, hotel_branch_id, type_room_id, location_id, room_status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                room.getArea(),
                room.getNumberOfBed(),
                room.getDescription(),
                room.getRoomIMG(),
                room.getHotelBranchID(),
                room.getTypeRoomID(),
                room.getLocationID(),
                room.getRoomStatusID()
        );
    }
}
