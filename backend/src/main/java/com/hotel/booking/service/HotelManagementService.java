package com.hotel.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.LocationsDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.exception.ConflictException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.HotelBranchRepository;
import com.hotel.booking.repository.RoomRepository;

@Service
public class HotelManagementService {
    private final HotelBranchRepository hotelRepository;
    private final RoomRepository roomRepository;

    public HotelManagementService(HotelBranchRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    public List<HotelBranchDTO> getAllHotels() {
        return hotelRepository.getAllHotelBranches();
    }

    public List<LocationsDTO> getLocations() {
        return hotelRepository.getLocations();
    }

    public HotelBranchDTO getHotelById(Integer hotelId) {
        HotelBranchDTO hotel = hotelRepository.getHotelBranchById(hotelId);
        if (hotel == null) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        return hotel;
    }

    @Transactional
    public HotelBranchDTO createHotel(HotelBranchDTO hotelDTO) {
        validateHotel(hotelDTO);
        return hotelRepository.createHotelBranch(hotelDTO);
    }

    @Transactional
    public HotelBranchDTO updateHotel(Integer hotelId, HotelBranchDTO hotelDTO) {
        getHotelById(hotelId);
        HotelBranchDTO updated = hotelRepository.updateHotelBranch(hotelId, hotelDTO);
        if (updated == null) {
            throw new ResourceNotFoundException("Hotel not found with ID: " + hotelId);
        }
        return updated;
    }

    @Transactional
    public void deleteHotel(Integer hotelId) {
        getHotelById(hotelId);
        hotelRepository.deleteHotelBranch(hotelId);
    }

    public List<RoomDTO> getHotelRooms(Integer hotelId) {
        getHotelById(hotelId);
        return roomRepository.getRoomsByHotelId(hotelId);
    }

    @Transactional
    public RoomDTO addRoom(Integer hotelId, RoomDTO roomDTO) {
        getHotelById(hotelId);
        normalizeRoomDefaults(roomDTO);
        validateRoom(roomDTO);
        normalizeAndValidateRoomType(roomDTO);
        ensureRoomNumberAvailable(hotelId, roomDTO.getRoomNumber(), null);
        return roomRepository.addRoom(hotelId, roomDTO);
    }

    @Transactional
    public RoomDTO updateRoom(Integer hotelId, Integer roomId, RoomDTO roomDTO) {
        getHotelById(hotelId);
        RoomDTO existing = roomRepository.getRoomByHotelAndId(hotelId, roomId);
        if (existing == null) {
            throw new ResourceNotFoundException("Room not found with ID: " + roomId);
        }

        int requestedRoomNumber = roomDTO.getRoomNumber() > 0 ? roomDTO.getRoomNumber() : existing.getRoomNumber();
        if (hasText(roomDTO.getTypeCode())) {
            roomDTO.setTypeCode(normalizedAllowedRoomType(roomDTO.getTypeCode()));
        }
        ensureRoomNumberAvailable(hotelId, requestedRoomNumber, roomId);

        RoomDTO updated = roomRepository.updateRoom(hotelId, roomId, roomDTO);
        if (updated == null) {
            throw new ResourceNotFoundException("Room not found with ID: " + roomId);
        }
        return updated;
    }

    @Transactional
    public void deleteRoom(Integer hotelId, Integer roomId) {
        getHotelById(hotelId);
        int affected = roomRepository.deleteRoom(hotelId, roomId);
        if (affected == 0) {
            throw new ResourceNotFoundException("Room not found with ID: " + roomId);
        }
    }

    private void validateHotel(HotelBranchDTO hotelDTO) {
        if (!hasText(hotelDTO.getAddress())) {
            throw new IllegalArgumentException("Hotel address is required");
        }
        if (!hasText(hotelDTO.getPhoneNumber())) {
            throw new IllegalArgumentException("Hotel phone number is required");
        }
        if (!hasText(hotelDTO.getLocationName())) {
            throw new IllegalArgumentException("Hotel location is required");
        }
    }

    private void validateRoom(RoomDTO roomDTO) {
        if (roomDTO.getRoomNumber() <= 0) {
            throw new IllegalArgumentException("Room number must be positive");
        }
        if (roomDTO.getFloor() <= 0) {
            throw new IllegalArgumentException("Room floor must be positive");
        }
        if (roomDTO.getNumberOfBed() <= 0) {
            throw new IllegalArgumentException("Number of beds must be positive");
        }
        if (roomDTO.getPrice() == null || roomDTO.getPrice() <= 0) {
            throw new IllegalArgumentException("Room price must be positive");
        }
        if (!hasText(roomDTO.getArea())) {
            throw new IllegalArgumentException("Room area is required");
        }
    }

    private void normalizeAndValidateRoomType(RoomDTO roomDTO) {
        roomDTO.setTypeCode(normalizedAllowedRoomType(roomDTO.getTypeCode()));
    }

    private String normalizedAllowedRoomType(String typeCode) {
        String normalized = hasText(typeCode) ? typeCode.trim().toUpperCase() : "SINGLE";
        if (!"SINGLE".equals(normalized) && !"DOUBLE".equals(normalized)) {
            throw new IllegalArgumentException("Room type must be SINGLE or DOUBLE");
        }
        return normalized;
    }

    private void ensureRoomNumberAvailable(Integer hotelId, Integer roomNumber, Integer excludingRoomId) {
        if (roomRepository.existsRoomNumberInHotel(hotelId, roomNumber, excludingRoomId)) {
            throw new ConflictException("Room number already exists in this hotel");
        }
    }

    private void normalizeRoomDefaults(RoomDTO roomDTO) {
        if (!hasText(roomDTO.getDescription())) {
            roomDTO.setDescription("No description");
        }
        if (!hasText(roomDTO.getRoomIMG())) {
            roomDTO.setRoomIMG("default-room.jpg");
        }
        if (!hasText(roomDTO.getTypeCode())) {
            roomDTO.setTypeCode("SINGLE");
        }
        if (!hasText(roomDTO.getRoomStatus())) {
            roomDTO.setRoomStatus("Available");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
