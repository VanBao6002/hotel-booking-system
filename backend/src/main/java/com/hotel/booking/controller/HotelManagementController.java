package com.hotel.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.LocationsDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.service.HotelManagementService;

/**
 * REST Controller for Hotel Management Admin APIs
 * Endpoints: /api/v1/hotels
 */
@RestController
@RequestMapping("/api/v1/hotels")
public class HotelManagementController {
    
    @Autowired
    private HotelManagementService hotelService;

    /**
     * GET /api/v1/hotels - Lấy danh sách tất cả khách sạn
     * Response: 200 OK với List<HotelBranchDTO>
     */
    @GetMapping
    public ResponseEntity<List<HotelBranchDTO>> getAllHotels() {
        List<HotelBranchDTO> hotels = hotelService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/locations")
    public ResponseEntity<List<LocationsDTO>> getLocations() {
        return ResponseEntity.ok(hotelService.getLocations());
    }

    /**
     * GET /api/v1/hotels/{hotelId} - Lấy chi tiết khách sạn
     * Response: 200 OK hoặc 404 Not Found
     */
    @GetMapping("/{hotelId}")
    public ResponseEntity<HotelBranchDTO> getHotelById(@PathVariable Integer hotelId) {
        HotelBranchDTO hotel = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotel);
    }

    /**
     * POST /api/v1/hotels - Tạo khách sạn mới
     * Request Body: HotelBranchDTO
     * Response: 201 Created với hotel mới
     */
    @PostMapping
    public ResponseEntity<HotelBranchDTO> createHotel(@RequestBody HotelBranchDTO hotelDTO) {
        HotelBranchDTO created = hotelService.createHotel(hotelDTO);
        return ResponseEntity.status(201).body(created);
    }

    /**
     * PUT /api/v1/hotels/{hotelId} - Cập nhật khách sạn
     * Request Body: HotelBranchDTO (chỉ cần fields cần update)
     * Response: 200 OK với hotel đã update
     */
    @PutMapping("/{hotelId}")
    public ResponseEntity<HotelBranchDTO> updateHotel(
            @PathVariable Integer hotelId,
            @RequestBody HotelBranchDTO hotelDTO) {
        HotelBranchDTO updated = hotelService.updateHotel(hotelId, hotelDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/v1/hotels/{hotelId} - Xóa khách sạn
     * Response: 204 No Content
     */
    @DeleteMapping("/{hotelId}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Integer hotelId) {
        hotelService.deleteHotel(hotelId);
        return ResponseEntity.noContent().build();
    }

    // ==================== ROOM MANAGEMENT ====================

    /**
     * GET /api/v1/hotels/{hotelId}/rooms - Lấy danh sách phòng của khách sạn
     * Response: 200 OK với List<RoomDTO>
     */
    @GetMapping("/{hotelId}/rooms")
    public ResponseEntity<List<RoomDTO>> getHotelRooms(@PathVariable Integer hotelId) {
        List<RoomDTO> rooms = hotelService.getHotelRooms(hotelId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * POST /api/v1/hotels/{hotelId}/rooms - Thêm phòng mới
     * Request Body: RoomDTO
     * Response: 201 Created với phòng mới
     */
    @PostMapping("/{hotelId}/rooms")
    public ResponseEntity<RoomDTO> addRoom(
            @PathVariable Integer hotelId,
            @RequestBody RoomDTO roomDTO) {
        RoomDTO created = hotelService.addRoom(hotelId, roomDTO);
        return ResponseEntity.status(201).body(created);
    }

    /**
     * PUT /api/v1/hotels/{hotelId}/rooms/{roomId} - Cập nhật phòng
     * Request Body: RoomDTO (chỉ cần fields cần update)
     * Response: 200 OK với phòng đã update
     */
    @PutMapping("/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable Integer hotelId,
            @PathVariable Integer roomId,
            @RequestBody RoomDTO roomDTO) {
        RoomDTO updated = hotelService.updateRoom(hotelId, roomId, roomDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/v1/hotels/{hotelId}/rooms/{roomId} - Xóa phòng
     * Response: 204 No Content
     */
    @DeleteMapping("/{hotelId}/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Integer hotelId,
            @PathVariable Integer roomId) {
        hotelService.deleteRoom(hotelId, roomId);
        return ResponseEntity.noContent().build();
    }
}
