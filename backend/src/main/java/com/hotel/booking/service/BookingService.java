package com.hotel.booking.service;


import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.dto.ApiResponse;
import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.repository.BookingRepository;

// // import java.sql.SQLException;
// import java.time.LocalDate;
// import java.util.ArrayList;
import java.util.List;
// import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public ApiResponse createBooking(BookingRequest request) {
        try {
            // Kiểm tra phòng trống trước
            boolean available = bookingRepository.isRoomBooked(
                request.getRoomId(),
                request.getCheckInDate(),
                request.getCheckOutDate()
            );

            if (!available) {
                return new ApiResponse(false, "Room is already booked for the selected dates");
            }

            int rows = bookingRepository.addBooking(request);
            if (rows > 0) {
                return new ApiResponse(true, "Booking created successfully");
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
