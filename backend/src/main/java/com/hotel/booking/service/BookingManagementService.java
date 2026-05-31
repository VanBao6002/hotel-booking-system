package com.hotel.booking.service;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
    public List<BookingDTO> searchBookings(String searchId, String guestName, String hotel, LocalDate startDate, LocalDate endDate) {
        return bookingRepository.searchBookings(searchId, guestName, hotel, startDate, endDate);
    }
}
