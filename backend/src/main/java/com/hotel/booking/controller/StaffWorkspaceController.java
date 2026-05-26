package com.hotel.booking.controller;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.dto.StaffDashboardDTO;
import com.hotel.booking.service.StaffWorkspaceService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/staff")
public class StaffWorkspaceController {
    private final StaffWorkspaceService staffWorkspaceService;

    public StaffWorkspaceController(StaffWorkspaceService staffWorkspaceService) {
        this.staffWorkspaceService = staffWorkspaceService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StaffDashboardDTO> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(staffWorkspaceService.getDashboard(authentication.getName()));
    }

    @GetMapping("/hotel")
    public ResponseEntity<HotelBranchDTO> getAssignedHotel(Authentication authentication) {
        return ResponseEntity.ok(staffWorkspaceService.getAssignedHotel(authentication.getName()));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomDTO>> getAssignedRooms(Authentication authentication) {
        return ResponseEntity.ok(staffWorkspaceService.getAssignedRooms(authentication.getName()));
    }

    @PutMapping("/rooms/{roomId}/status")
    public ResponseEntity<RoomDTO> updateAssignedRoomStatus(
            Authentication authentication,
            @PathVariable Integer roomId,
            @RequestBody RoomStatusRequest request) {
        return ResponseEntity.ok(staffWorkspaceService.updateAssignedRoomStatus(
                authentication.getName(),
                roomId,
                request.getRoomStatus()));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getAssignedBookings(Authentication authentication) {
        return ResponseEntity.ok(staffWorkspaceService.getAssignedBookings(authentication.getName()));
    }

    @PostMapping("/bookings/search")
    public ResponseEntity<List<BookingDTO>> searchAssignedBookings(
            Authentication authentication,
            @RequestBody SearchBookingRequest request) {
        return ResponseEntity.ok(staffWorkspaceService.searchAssignedBookings(
                authentication.getName(),
                request.getSearchId(),
                request.getGuestName(),
                request.getStartDate(),
                request.getEndDate()));
    }

    public static class RoomStatusRequest {
        private String roomStatus;

        public String getRoomStatus() {
            return roomStatus;
        }

        public void setRoomStatus(String roomStatus) {
            this.roomStatus = roomStatus;
        }
    }

    public static class SearchBookingRequest {
        private String searchId;
        private String guestName;
        private LocalDate startDate;
        private LocalDate endDate;

        public String getSearchId() {
            return searchId;
        }

        public void setSearchId(String searchId) {
            this.searchId = searchId;
        }

        public String getGuestName() {
            return guestName;
        }

        public void setGuestName(String guestName) {
            this.guestName = guestName;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }
    }
}
