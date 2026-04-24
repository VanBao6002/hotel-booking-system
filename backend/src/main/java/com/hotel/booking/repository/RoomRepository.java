package com.hotel.booking.repository;

import com.hotel.booking.dto.RoomDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RoomRepository {
    private final JdbcTemplate jdbcTemplate;

    public RoomRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả phòng
public List<RoomDTO> getAllRooms() {
    String sql = "SELECT r.id, r.room_number, r.floor, r.area, r.number_of_bed,r.price, r.description, r.room_img, " +
                 "hb.address AS hotel_branch_address, tr.code AS type_code, rs.status AS room_status " +
                 "FROM room r " +
                 "JOIN hotelbranch hb ON r.hotel_branch_id = hb.id " +
                 "JOIN typeroom tr ON r.type_room_id = tr.id " +
                 "JOIN roomstatus rs ON r.room_status_id = rs.id";

    List<RoomDTO> rooms = jdbcTemplate.query(sql, (rs, rowNum) ->
        new RoomDTO(
            rs.getInt("id"),
            rs.getInt("room_number"),
            rs.getInt("floor"),
            rs.getString("area"),
            rs.getInt("number_of_bed"),
            rs.getLong("price"),
            rs.getString("description"),
            rs.getString("room_img"),
            rs.getString("hotel_branch_address"),
            rs.getString("type_code"),
            rs.getString("room_status"),
            new ArrayList<>() // tạm thời rỗng, sẽ load sau
        )
    );

    // load services cho từng room
    for (RoomDTO room : rooms) {
        String sqlServices = "SELECT s.name " +
                             "FROM room_type_services rts " +
                             "JOIN services s ON rts.service_id = s.id " +
                             "JOIN typeroom tr ON rts.room_type_id = tr.id " +
                             "WHERE tr.code = ?";
        List<String> services = jdbcTemplate.query(sqlServices, new Object[]{room.getTypeCode()},
                (rs, rowNum) -> rs.getString("name"));
        room.setServices(services);
    }

    return rooms;
}


    // Lấy phòng theo ID
   public RoomDTO getRoomById(int id) {
    String sql = "SELECT r.id, r.room_number, r.floor, r.area, r.number_of_bed,r.price, r.description, r.room_img, " +
                 "hb.address AS hotel_branch_address, tr.code AS type_code, rs.status AS room_status " +
                 "FROM room r " +
                 "JOIN hotelbranch hb ON r.hotel_branch_id = hb.id " +
                 "JOIN typeroom tr ON r.type_room_id = tr.id " +
                 "JOIN roomstatus rs ON r.room_status_id = rs.id " +
                 "WHERE r.id = ?";

    RoomDTO room = jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) ->
        new RoomDTO(
            rs.getInt("id"),
            rs.getInt("room_number"),
            rs.getInt("floor"),
            rs.getString("area"),
            rs.getInt("number_of_bed"),
            rs.getLong("price"),
            rs.getString("description"),
            rs.getString("room_img"),
            rs.getString("hotel_branch_address"),
            rs.getString("type_code"),
            rs.getString("room_status"),
            new ArrayList<>() // khởi tạo list rỗng
        )
    );

    // Lấy danh sách dịch vụ theo loại phòng
    String sqlServices = "SELECT s.name " +
                         "FROM room_type_services rts " +
                         "JOIN services s ON rts.service_id = s.id " +
                         "JOIN typeroom tr ON rts.room_type_id = tr.id " +
                         "WHERE tr.code = ?";
    List<String> services = jdbcTemplate.query(sqlServices, new Object[]{room.getTypeCode()},
            (rs, rowNum) -> rs.getString("name"));

    room.setServices(services);

    return room;
}

    // Thêm phòng mới
    // public void addRoom(RoomDTO room) {
    //     String sql = "INSERT INTO room(room_number, floor, area, number_of_bed, description, room_img, hotel_branch_id, type_room_id, room_status_id) " +
    //                  "VALUES (?, ?, ?, ?, ?, ?, " +
    //                  "(SELECT id FROM hotelbranch WHERE address = ?), " +
    //                  "(SELECT id FROM typeroom WHERE code = ?), " +
    //                  "(SELECT id FROM roomstatus WHERE status = ?))";

    //     jdbcTemplate.update(sql,
    //             room.getRoomNumber(),
    //             room.getFloor(),
    //             room.getArea(),
    //             room.getNumberOfBed(),
    //             room.getDescription(),
    //             room.getRoomIMG(),
    //             room.getHotelBranchAddress(),
    //             room.getTypeCode(),
    //             room.getRoomStatus()
    //     );
    // }
}
