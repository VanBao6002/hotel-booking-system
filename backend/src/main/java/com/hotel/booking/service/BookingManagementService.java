package com.hotel.booking.service;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingManagementService {
    
    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Lấy danh sách tất cả đặt phòng
     */
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.getAllBookings();
    }

    /**
     * Lấy chi tiết đặt phòng theo ID
     */
    public BookingDTO getBookingById(Integer bookingId) {
        return bookingRepository.getBookingById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    /**
     * Tìm kiếm đặt phòng
     */
    public List<BookingDTO> searchBookings(String searchId, String guestName, String hotel) {
        return bookingRepository.getAllBookings().stream()
            .filter(b -> {
                boolean idMatch = isBlank(searchId)
                    || b.getId().toLowerCase().contains(searchId.toLowerCase())
                    || b.getId().replace("B-", "").contains(searchId.replace("B-", ""));
                boolean guestMatch = isBlank(guestName)
                    || valueOf(b.getGuestName()).toLowerCase().contains(guestName.toLowerCase());
                boolean hotelMatch = isBlank(hotel)
                    || valueOf(b.getHotelName()).toLowerCase().contains(hotel.toLowerCase());
                return idMatch && guestMatch && hotelMatch;
            })
            .collect(Collectors.toList());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String valueOf(String value) {
        return value == null ? "" : value;
    }
}
