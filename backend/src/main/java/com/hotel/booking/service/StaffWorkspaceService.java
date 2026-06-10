package com.hotel.booking.service;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.dto.StaffDashboardDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StaffWorkspaceService {
    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final HotelManagementService hotelManagementService;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public StaffWorkspaceService(
            UserRepository userRepository,
            JdbcTemplate jdbcTemplate,
            HotelManagementService hotelManagementService,
            RoomRepository roomRepository,
            BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.hotelManagementService = hotelManagementService;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public StaffDashboardDTO getDashboard(String username) {
        Integer hotelBranchId = resolveAssignedHotelBranchId(username);
        HotelBranchDTO hotel = hotelManagementService.getHotelById(hotelBranchId);
        List<RoomDTO> rooms = roomRepository.getRoomsByHotelId(hotelBranchId);
        refreshRoomsStatusByBookingDate(rooms);
        List<BookingDTO> bookings = bookingRepository.getBookingsByHotelBranchId(hotelBranchId);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        StaffDashboardDTO dashboard = new StaffDashboardDTO();
        dashboard.setHotelBranchId(hotelBranchId);
        dashboard.setHotel(hotel);
        dashboard.setRooms(rooms);
        dashboard.setRecentBookings(bookings.stream()
                .sorted(Comparator.comparing(BookingDTO::getBookedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .toList());
        dashboard.setTotalRooms(rooms.size());
        dashboard.setAvailableRooms(countRoomsByStatus(rooms, "Available"));
        dashboard.setBookedRooms(countRoomsByStatus(rooms, "Booked"));
        dashboard.setMaintenanceRooms(countRoomsByStatus(rooms, "Maintenance"));
        dashboard.setTotalBookings(bookings.size());
        dashboard.setActiveBookings((int) bookings.stream()
                .filter(booking -> !"Completed".equalsIgnoreCase(booking.getBookingStatus()))
                .count());
        dashboard.setTodayCheckIns((int) bookings.stream()
                .filter(booking -> today.equals(booking.getCheckInDate()))
                .count());
        dashboard.setTodayCheckOuts((int) bookings.stream()
                .filter(booking -> today.equals(booking.getCheckOutDate()))
                .count());
        return dashboard;
    }

    public HotelBranchDTO getAssignedHotel(String username) {
        return hotelManagementService.getHotelById(resolveAssignedHotelBranchId(username));
    }

    public List<RoomDTO> getAssignedRooms(String username) {
        List<RoomDTO> rooms = roomRepository.getRoomsByHotelId(resolveAssignedHotelBranchId(username));
        refreshRoomsStatusByBookingDate(rooms);
        return rooms;
    }

    public List<BookingDTO> getAssignedBookings(String username) {
        return bookingRepository.getBookingsByHotelBranchId(resolveAssignedHotelBranchId(username));
    }

    public List<BookingDTO> searchAssignedBookings(
            String username,
            String searchId,
            String guestName,
            LocalDate startDate,
            LocalDate endDate) {
        return bookingRepository.searchBookingsByHotelBranchId(
                resolveAssignedHotelBranchId(username),
                searchId,
                guestName,
                startDate,
                endDate);
    }

    @Transactional
    public RoomDTO updateAssignedRoomStatus(String username, Integer roomId, String roomStatus) {
        Integer hotelBranchId = resolveAssignedHotelBranchId(username);
        RoomDTO statusUpdate = new RoomDTO();
        statusUpdate.setRoomStatus(hasText(roomStatus) ? roomStatus.trim() : "Available");
        RoomDTO updated = roomRepository.updateRoom(hotelBranchId, roomId, statusUpdate);
        if (updated == null) {
            throw new ResourceNotFoundException("Room not found in assigned hotel with ID: " + roomId);
        }
        return updated;
    }

    private Integer resolveAssignedHotelBranchId(String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Integer> branchIds = jdbcTemplate.query(
                "SELECT HotelBranchID FROM staff WHERE UserID = ? AND HotelBranchID IS NOT NULL LIMIT 1",
                (rs, rowNum) -> rs.getInt("HotelBranchID"),
                user.getId());

        if (branchIds.isEmpty()) {
            throw new ResourceNotFoundException("Staff account is not assigned to a hotel branch");
        }

        return branchIds.get(0);
    }

    private int countRoomsByStatus(List<RoomDTO> rooms, String status) {
        return (int) rooms.stream()
                .filter(room -> status.equalsIgnoreCase(room.getRoomStatus()))
                .count();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private void refreshRoomsStatusByBookingDate(List<RoomDTO> rooms) {
        if (rooms == null || rooms.isEmpty()) {
            return;
        }

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        for (RoomDTO room : rooms) {
            if (room == null || "Maintenance".equalsIgnoreCase(room.getRoomStatus())) {
                continue;
            }
            boolean booked = bookingRepository.isRoomBookedOn(room.getId(), today);
            room.setRoomStatus(booked ? "Booked" : "Available");
        }
    }
}
