package com.hotel.booking.repository;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.LocationsDTO;
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
public class HotelBranchRepository {
    private final JdbcTemplate jdbcTemplate;
    private final DatabaseSchemaInspector schemaInspector;

    public HotelBranchRepository(JdbcTemplate jdbcTemplate, DatabaseSchemaInspector schemaInspector) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemaInspector = schemaInspector;
    }

    private final RowMapper<HotelBranchDTO> hotelMapper = (rs, rowNum) -> {
        HotelBranchDTO hotel = new HotelBranchDTO(
            rs.getInt("id"),
            rs.getString("address"),
            rs.getString("phone_number"),
            rs.getString("location_name"),
            rs.getDouble("average_star"),
            rs.getInt("room_count")
        );
        hotel.setImageUrl(rs.getString("image_url"));
        return hotel;
    };

    public List<LocationsDTO> getLocations() {
        return jdbcTemplate.query(
            "SELECT id, name FROM location ORDER BY name",
            (rs, rowNum) -> new LocationsDTO(
                rs.getInt("id"),
                rs.getString("name")
            )
        );
    }

    public List<HotelBranchDTO> getAllHotelBranches() {
        String sql = """
            SELECT hb.id,
                   hb.address,
                   hb.phone_number,
                   %s AS image_url,
                   l.name AS location_name,
                   COALESCE(hrs.average_star, 0) AS average_star,
                   COUNT(r.id) AS room_count
            FROM hotelbranch hb
            LEFT JOIN location l ON hb.location_id = l.id
            LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id
            LEFT JOIN room r ON r.hotel_branch_id = hb.id
            GROUP BY hb.id, hb.address, hb.phone_number, l.name, hrs.average_star
            ORDER BY hb.id
            """.formatted(hotelImageExpression());

        List<HotelBranchDTO> branches = jdbcTemplate.query(sql, hotelMapper);
        branches.forEach(this::loadBranchServices);
        return branches;
    }

    public List<HotelBranchDTO> getHotelBranchesByLocation(String locationName) {
        String sql = """
            SELECT hb.id,
                   hb.address,
                   hb.phone_number,
                   %s AS image_url,
                   l.name AS location_name,
                   COALESCE(hrs.average_star, 0) AS average_star,
                   COUNT(r.id) AS room_count
            FROM hotelbranch hb
            LEFT JOIN location l ON hb.location_id = l.id
            LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id
            LEFT JOIN room r ON r.hotel_branch_id = hb.id
            WHERE l.name LIKE ?
            GROUP BY hb.id, hb.address, hb.phone_number, l.name, hrs.average_star
            ORDER BY hb.id
            """.formatted(hotelImageExpression());

        List<HotelBranchDTO> branches = jdbcTemplate.query(sql, hotelMapper, "%" + locationName + "%");
        branches.forEach(this::loadBranchServices);
        return branches;
    }

    public HotelBranchDTO getHotelBranchById(int id) {
        String sql = """
            SELECT hb.id,
                   hb.address,
                   hb.phone_number,
                   %s AS image_url,
                   l.name AS location_name,
                   COALESCE(hrs.average_star, 0) AS average_star,
                   COUNT(r.id) AS room_count
            FROM hotelbranch hb
            LEFT JOIN location l ON hb.location_id = l.id
            LEFT JOIN hotelratingsummary hrs ON hb.id = hrs.hotel_branch_id
            LEFT JOIN room r ON r.hotel_branch_id = hb.id
            WHERE hb.id = ?
            GROUP BY hb.id, hb.address, hb.phone_number, l.name, hrs.average_star
            """.formatted(hotelImageExpression());

        List<HotelBranchDTO> rows = jdbcTemplate.query(sql, hotelMapper, id);
        if (rows.isEmpty()) {
            return null;
        }

        HotelBranchDTO branch = rows.get(0);
        branch.setRooms(getRoomsByHotelId(id));
        loadBranchServices(branch);
        return branch;
    }

    public HotelBranchDTO createHotelBranch(HotelBranchDTO hotel) {
        Integer locationId = resolveLocationId(hotel.getLocationName());
        KeyHolder keyHolder = new GeneratedKeyHolder();
        boolean hasImageColumn = hasHotelImageColumn();
        String insertSql = hasImageColumn
            ? "INSERT INTO hotelbranch(address, phone_number, location_id, image_url) VALUES (?, ?, ?, ?)"
            : "INSERT INTO hotelbranch(address, phone_number, location_id) VALUES (?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                insertSql,
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, hotel.getAddress());
            ps.setString(2, hotel.getPhoneNumber());
            if (locationId == null) {
                ps.setObject(3, null);
            } else {
                ps.setInt(3, locationId);
            }
            if (hasImageColumn) {
                ps.setString(4, blankToNull(hotel.getImageUrl()));
            }
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return getHotelBranchById(key == null ? hotel.getId() : key.intValue());
    }

    public HotelBranchDTO updateHotelBranch(Integer hotelId, HotelBranchDTO hotel) {
        HotelBranchDTO existing = getHotelBranchById(hotelId);
        if (existing == null) {
            return null;
        }

        String address = hasText(hotel.getAddress()) ? hotel.getAddress() : existing.getAddress();
        String phoneNumber = hasText(hotel.getPhoneNumber()) ? hotel.getPhoneNumber() : existing.getPhoneNumber();
        String imageUrl = hotel.getImageUrl() != null ? blankToNull(hotel.getImageUrl()) : existing.getImageUrl();
        Integer locationId = hasText(hotel.getLocationName())
            ? resolveLocationId(hotel.getLocationName())
            : resolveLocationId(existing.getLocationName());

        if (hasHotelImageColumn()) {
            jdbcTemplate.update(
                "UPDATE hotelbranch SET address = ?, phone_number = ?, location_id = ?, image_url = ? WHERE id = ?",
                address,
                phoneNumber,
                locationId,
                imageUrl,
                hotelId
            );
        } else {
            jdbcTemplate.update(
                "UPDATE hotelbranch SET address = ?, phone_number = ?, location_id = ? WHERE id = ?",
                address,
                phoneNumber,
                locationId,
                hotelId
            );
        }

        return getHotelBranchById(hotelId);
    }

    public int updateHotelImage(int hotelId, String imageUrl) {
        return jdbcTemplate.update("UPDATE hotelbranch SET image_url = ? WHERE id = ?", imageUrl, hotelId);
    }

    public int deleteHotelBranch(Integer hotelId) {
        jdbcTemplate.update("DELETE FROM hotel_services WHERE hotel_id = ?", hotelId);
        jdbcTemplate.update("DELETE FROM hotelratingsummary WHERE hotel_branch_id = ?", hotelId);
        jdbcTemplate.update("DELETE FROM hotelreview WHERE hotel_branch_id = ?", hotelId);
        return jdbcTemplate.update("DELETE FROM hotelbranch WHERE id = ?", hotelId);
    }

    public List<RoomDTO> getRoomsByHotelId(int id) {
        String sql = """
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
            WHERE r.hotel_branch_id = ?
            ORDER BY r.room_number
            """;

        List<RoomDTO> rooms = jdbcTemplate.query(sql, roomMapper(), id);
        rooms.forEach(this::loadRoomServices);
        return rooms;
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

    private void loadBranchServices(HotelBranchDTO branch) {
        String sql = """
            SELECT s.name
            FROM hotel_services hs
            JOIN services s ON hs.service_id = s.id
            WHERE hs.hotel_id = ?
            ORDER BY s.name
            """;

        List<String> services = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("name"), branch.getId());
        branch.setServices(services);
    }

    private void loadRoomServices(RoomDTO room) {
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

    private Integer resolveLocationId(String locationName) {
        if (!hasText(locationName)) {
            return null;
        }

        List<Integer> existingIds = jdbcTemplate.query(
            "SELECT id FROM location WHERE LOWER(name) = LOWER(?) LIMIT 1",
            (rs, rowNum) -> rs.getInt("id"),
            locationName.trim()
        );

        if (!existingIds.isEmpty()) {
            return existingIds.get(0);
        }

        throw new IllegalArgumentException("Location must exist in database: " + locationName.trim());
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean hasHotelImageColumn() {
        return schemaInspector.columnExists("hotelbranch", "image_url");
    }

    private String hotelImageExpression() {
        return hasHotelImageColumn() ? "hb.image_url" : "NULL";
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
