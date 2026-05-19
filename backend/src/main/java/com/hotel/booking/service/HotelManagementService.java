package com.hotel.booking.service;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.HotelBranchRepository;
import com.hotel.booking.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        return roomRepository.addRoom(hotelId, roomDTO);
    }

    @Transactional
    public RoomDTO updateRoom(Integer hotelId, Integer roomId, RoomDTO roomDTO) {
        getHotelById(hotelId);
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
