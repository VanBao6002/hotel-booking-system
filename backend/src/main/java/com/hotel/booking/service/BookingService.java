package com.hotel.booking.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.hotel.booking.dto.ApiResponse;
import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.repository.BookingRepository;
@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public ApiResponse createBooking(BookingRequest request) {
        try {
            // Kiểm tra phòng trống trước
            boolean available = bookingRepository.isRoomAvailable(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
            );

            if (!available) {
                return new ApiResponse(false, "Room is already booked for the selected dates");
            }

            // Nếu tất cả phòng đều trống → thêm booking
            int bookingId = bookingRepository.addBooking(request);
            if (bookingId > 0) {
                return new ApiResponse(true, "Booking created successfully with ID: " + bookingId);
            } else {
                return new ApiResponse(false, "Failed to create booking");
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage());
        }
    }

    public List<BookingDTO> getUserBookings(int userId) {
        return bookingRepository.getBookingsByUserId(userId);
    }
}
