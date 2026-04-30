package com.hotel.booking.repository;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class HotelBranchRepository {
    private final JdbcTemplate jdbcTemplate;

    public HotelBranchRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả chi nhánh
   // Lấy tất cả chi nhánh (kèm dịch vụ chung, chưa load rooms)
public List<HotelBranchDTO> getAllHotelBranches() {
    String sql = "SELECT hb.id, hb.address, hb.phone_number, l.name AS location_name, " +
                 "COALESCE(hrs.average_star, 0) AS average_star " +
                 "FROM hotelbranch hb " +
                 "JOIN location l ON hb.location_id = l.id " +
                 "LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id";

    List<HotelBranchDTO> branches = jdbcTemplate.query(sql, (rs, rowNum) ->
        new HotelBranchDTO(
            rs.getInt("id"),
            rs.getString("address"),
            rs.getString("phone_number"),
            rs.getString("location_name"), // tên khu vực
            rs.getDouble("average_star"),
            new ArrayList<>(),              // rooms
            new ArrayList<>()          // services 
        )
    );

    // Load dịch vụ chung cho từng chi nhánh
    for (HotelBranchDTO branch : branches) {
        String sqlBranchServices = "SELECT s.name " +
                                "FROM hotel_services hs " +
                                "JOIN services s ON hs.service_id = s.id " +
                                "WHERE hs.hotel_id = ?";

        List<String> branchServices = jdbcTemplate.query(
            sqlBranchServices,
            (rs, rowNum) -> rs.getString("name"),
            branch.getId() // truyền trực tiếp varargs
        );

        branch.setServices(branchServices);
    }


    return branches;
}
public List<HotelBranchDTO> getHotelBranchesByLocation(String locationName) {
    String sql = "SELECT hb.id, hb.address, hb.phone_number, l.name AS location_name, " +
                 "COALESCE(hrs.average_star, 0) AS average_star " +
                 "FROM hotelbranch hb " +
                 "JOIN location l ON hb.location_id = l.id " +
                 "LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id " +
                 "WHERE l.name LIKE ?";

    List<HotelBranchDTO> branches = jdbcTemplate.query(
        sql,
        (rs, rowNum) -> new HotelBranchDTO(
            rs.getInt("id"),
            rs.getString("address"),
            rs.getString("phone_number"),
            rs.getString("location_name"),
            rs.getDouble("average_star"),
            new ArrayList<>(),   // rooms
            new ArrayList<>()    // services
        ),
        "%" + locationName + "%" // truyền trực tiếp varargs
    );


    // Load dịch vụ chung cho từng chi nhánh
    for (HotelBranchDTO branch : branches) {
        String sqlBranchServices = "SELECT s.name " +
                                "FROM hotel_services hs " +
                                "JOIN services s ON hs.service_id = s.id " +
                                "WHERE hs.hotel_id = ?";

        List<String> branchServices = jdbcTemplate.query(
            sqlBranchServices,
            (rs, rowNum) -> rs.getString("name"),
            branch.getId() // truyền trực tiếp varargs thay vì new Object[]{...}
        );

        branch.setServices(branchServices);
    }


    return branches;
}


// Lấy chi nhánh theo ID (kèm rooms và services)
public HotelBranchDTO getHotelBranchById(int id) {
    String sqlBranch = "SELECT hb.id, hb.address, hb.phone_number, l.name AS location_name, " +
                       "COALESCE(hrs.average_star, 0) AS average_star " +
                       "FROM hotelbranch hb " +
                       "JOIN location l ON hb.location_id = l.id " +
                       "LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id " +
                       "WHERE hb.id = ?";
    HotelBranchDTO branch = jdbcTemplate.queryForObject(
        sqlBranch,
        (rs, rowNum) -> new HotelBranchDTO(
            rs.getInt("id"),
            rs.getString("address"),
            rs.getString("phone_number"),
            rs.getString("location_name"), // lấy tên khu vực
            rs.getDouble("average_star"),
            new ArrayList<>(),              // rooms
            new ArrayList<>()               // services
        ),
        id // truyền trực tiếp varargs thay vì new Object[]{id}
    );


    // Lấy danh sách phòng
    String sqlRooms = "SELECT r.id, r.room_number, r.floor, r.area, r.number_of_bed,r.price, r.description, r.room_img, " +
                      "hb.address AS hotel_branch_address, tr.code AS type_code, rs.status AS room_status " +
                      "FROM room r " +
                      "JOIN hotelbranch hb ON r.hotel_branch_id = hb.id " +
                      "JOIN typeroom tr ON r.type_room_id = tr.id " +
                      "JOIN roomstatus rs ON r.room_status_id = rs.id " +
                      "WHERE r.hotel_branch_id = ?";

    List<RoomDTO> rooms = jdbcTemplate.query(
        sqlRooms,
        (rs, rowNum) -> new RoomDTO(
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
            new ArrayList<>() // services riêng của phòng
        ),
        id // truyền trực tiếp varargs thay vì new Object[]{id}
    );


    // Load services cho từng phòng
    for (RoomDTO room : rooms) {
        String sqlServices = "SELECT s.name " +
                            "FROM room_type_services rts " +
                            "JOIN services s ON rts.service_id = s.id " +
                            "JOIN typeroom tr ON rts.room_type_id = tr.id " +
                            "WHERE tr.code = ?";

        List<String> services = jdbcTemplate.query(
            sqlServices,
            (rs, rowNum) -> rs.getString("name"),
            room.getTypeCode() // truyền trực tiếp varargs thay vì new Object[]{...}
        );

        room.setServices(services);
    }


    branch.setRooms(rooms);

    // Load dịch vụ chung của chi nhánh
    String sqlBranchServices = "SELECT s.name " +
                            "FROM hotel_services hs " +
                            "JOIN services s ON hs.service_id = s.id " +
                            "WHERE hs.hotel_id = ?";

    List<String> branchServices = jdbcTemplate.query(
        sqlBranchServices,
        (rs, rowNum) -> rs.getString("name"),
        id // truyền trực tiếp varargs thay vì new Object[]{id}
    );

    branch.setServices(branchServices);

    return branch;

}


    // Thêm chi nhánh mới
    // public void addBranch(HotelBranchDTO branch) {
    //     String sql = "INSERT INTO hotelbranch(address, phone_number) VALUES (?, ?)";
    //     jdbcTemplate.update(sql, branch.getAddress(), branch.getPhoneNumber());
    // }
}
