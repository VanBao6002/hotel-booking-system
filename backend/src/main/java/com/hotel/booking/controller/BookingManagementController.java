package com.hotel.booking.controller;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.service.BookingManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Booking Management Admin APIs
 * Endpoints: /api/v1/bookings
 */
@RestController
@RequestMapping("/api/v1/bookings")
public class BookingManagementController {
    
    @Autowired
    private BookingManagementService bookingService;

    /**
     * GET /api/v1/bookings - Lấy danh sách tất cả đặt phòng
     * Query params: page, pageSize, status
     * Response: 200 OK với List<BookingDTO>
     */
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) String status) {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    /**
     * GET /api/v1/bookings/{bookingId} - Lấy chi tiết đặt phòng
     * Response: 200 OK hoặc 404 Not Found
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Integer bookingId) {
        BookingDTO booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    /**
     * POST /api/v1/bookings/search - Tìm kiếm đặt phòng
     * Request Body: { "searchId": "B-1", "guestName": "John", "hotel": "Oceanfront" }
     * Response: 200 OK với List<BookingDTO> phù hợp
     */
    @PostMapping("/search")
    public ResponseEntity<List<BookingDTO>> searchBookings(@RequestBody SearchBookingRequest request) {
        List<BookingDTO> results = bookingService.searchBookings(
            request.getSearchId(),
            request.getGuestName(),
            request.getHotel(),
            request.getStartDate(),
            request.getEndDate()
        );
        return ResponseEntity.ok(results);
    }

    /**
     * Helper class for search request
     */
    public static class SearchBookingRequest {
        private String searchId;
        private String guestName;
        private String hotel;
        private LocalDate startDate;
        private LocalDate endDate;

        public SearchBookingRequest() {}

        public String getSearchId() { return searchId; }
        public void setSearchId(String searchId) { this.searchId = searchId; }

        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }

        public String getHotel() { return hotel; }
        public void setHotel(String hotel) { this.hotel = hotel; }

        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    }
}
