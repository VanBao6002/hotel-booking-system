package com.hotel.booking.repository;

import com.hotel.booking.dto.RoomDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RoomRepository {
    private final JdbcTemplate jdbcTemplate;

    public RoomRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<RoomDTO> getAllRooms() {
        List<RoomDTO> rooms = jdbcTemplate.query(baseRoomSql() + " ORDER BY hb.id, r.room_number", roomMapper());
        rooms.forEach(this::loadServices);
        return rooms;
    }

    public RoomDTO getRoomById(int id) {
        List<RoomDTO> rows = jdbcTemplate.query(baseRoomSql() + " WHERE r.id = ?", roomMapper(), id);
        if (rows.isEmpty()) {
            return null;
        }

        RoomDTO room = rows.get(0);
        loadServices(room);
        return room;
    }

    public List<RoomDTO> getRoomsByHotelId(int hotelId) {
        List<RoomDTO> rooms = jdbcTemplate.query(
            baseRoomSql() + " WHERE r.hotel_branch_id = ? ORDER BY r.room_number",
            roomMapper(),
            hotelId
        );
        rooms.forEach(this::loadServices);
        return rooms;
    }

    public RoomDTO getRoomByHotelAndId(int hotelId, int roomId) {
        List<RoomDTO> rows = jdbcTemplate.query(
            baseRoomSql() + " WHERE r.hotel_branch_id = ? AND r.id = ?",
            roomMapper(),
            hotelId,
            roomId
        );
        if (rows.isEmpty()) {
            return null;
        }

        RoomDTO room = rows.get(0);
        loadServices(room);
        return room;
    }

    public RoomDTO addRoom(Integer hotelId, RoomDTO room) {
        Integer typeRoomId = resolveTypeRoomId(room.getTypeCode());
        Integer roomStatusId = resolveRoomStatusId(room.getRoomStatus());
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                """
                INSERT INTO room(room_number, floor, area, number_of_bed, price, description, room_img,
                                 hotel_branch_id, type_room_id, room_status_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setInt(1, room.getRoomNumber());
            ps.setInt(2, room.getFloor());
            ps.setString(3, room.getArea());
            ps.setInt(4, room.getNumberOfBed());
            ps.setLong(5, room.getPrice());
            ps.setString(6, room.getDescription());
            ps.setString(7, room.getRoomIMG());
            ps.setInt(8, hotelId);
            ps.setInt(9, typeRoomId);
            ps.setInt(10, roomStatusId);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return getRoomByHotelAndId(hotelId, key == null ? room.getId() : key.intValue());
    }

    public RoomDTO updateRoom(Integer hotelId, Integer roomId, RoomDTO room) {
        RoomDTO existing = getRoomByHotelAndId(hotelId, roomId);
        if (existing == null) {
            return null;
        }

        int roomNumber = room.getRoomNumber() > 0 ? room.getRoomNumber() : existing.getRoomNumber();
        int floor = room.getFloor() > 0 ? room.getFloor() : existing.getFloor();
        String area = hasText(room.getArea()) ? room.getArea() : existing.getArea();
        int numberOfBed = room.getNumberOfBed() > 0 ? room.getNumberOfBed() : existing.getNumberOfBed();
        Long price = room.getPrice() != null && room.getPrice() > 0 ? room.getPrice() : existing.getPrice();
        String description = hasText(room.getDescription()) ? room.getDescription() : existing.getDescription();
        String roomImg = hasText(room.getRoomIMG()) ? room.getRoomIMG() : existing.getRoomIMG();
        String typeCode = hasText(room.getTypeCode()) ? room.getTypeCode() : existing.getTypeCode();
        String roomStatus = hasText(room.getRoomStatus()) ? room.getRoomStatus() : existing.getRoomStatus();

        jdbcTemplate.update(
            """
            UPDATE room
            SET room_number = ?,
                floor = ?,
                area = ?,
                number_of_bed = ?,
                price = ?,
                description = ?,
                room_img = ?,
                type_room_id = ?,
                room_status_id = ?
            WHERE id = ? AND hotel_branch_id = ?
            """,
            roomNumber,
            floor,
            area,
            numberOfBed,
            price,
            description,
            roomImg,
            resolveTypeRoomId(typeCode),
            resolveRoomStatusId(roomStatus),
            roomId,
            hotelId
        );

        return getRoomByHotelAndId(hotelId, roomId);
    }

    public int deleteRoom(Integer hotelId, Integer roomId) {
        return jdbcTemplate.update("DELETE FROM room WHERE id = ? AND hotel_branch_id = ?", roomId, hotelId);
    }

    private String baseRoomSql() {
        return """
            SELECT r.id,
                   r.room_number,
                   r.floor,
                   r.area,
                   r.number_of_bed,
                   r.price,
                   r.description,
                   r.room_img,
                   hb.address AS hotel_branch_address,
                   tr.code AS type_code,
                   rs.status AS room_status
            FROM room r
            LEFT JOIN hotelbranch hb ON r.hotel_branch_id = hb.id
            LEFT JOIN typeroom tr ON r.type_room_id = tr.id
            LEFT JOIN roomstatus rs ON r.room_status_id = rs.id
            """;
    }

    private RowMapper<RoomDTO> roomMapper() {
        return (rs, rowNum) -> new RoomDTO(
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
            new ArrayList<>()
        );
    }

    private void loadServices(RoomDTO room) {
        if (!hasText(room.getTypeCode())) {
            room.setServices(List.of());
            return;
        }

        String sql = """
            SELECT s.name
            FROM room_type_services rts
            JOIN services s ON rts.service_id = s.id
            JOIN typeroom tr ON rts.room_type_id = tr.id
            WHERE tr.code = ?
            ORDER BY s.name
            """;

        List<String> services = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("name"), room.getTypeCode());
        room.setServices(services);
    }

    private Integer resolveTypeRoomId(String typeCode) {
        String code = hasText(typeCode) ? typeCode.trim() : "SINGLE";
        List<Integer> ids = jdbcTemplate.query(
            "SELECT id FROM typeroom WHERE LOWER(code) = LOWER(?) LIMIT 1",
            (rs, rowNum) -> rs.getInt("id"),
            code
        );
        if (ids.isEmpty()) {
            throw new IllegalArgumentException("Unsupported room type: " + code);
        }
        return ids.get(0);
    }

    private Integer resolveRoomStatusId(String roomStatus) {
        String status = hasText(roomStatus) ? roomStatus.trim() : "Available";
        List<Integer> ids = jdbcTemplate.query(
            "SELECT id FROM roomstatus WHERE LOWER(status) = LOWER(?) LIMIT 1",
            (rs, rowNum) -> rs.getInt("id"),
            status
        );
        if (ids.isEmpty()) {
            throw new IllegalArgumentException("Unsupported room status: " + status);
        }
        return ids.get(0);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
