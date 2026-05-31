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
            if (request.getRoomIds() == null || request.getRoomIds().isEmpty()) {
                return new ApiResponse(false, "Room IDs cannot be empty");
            }

            for (Integer roomId : request.getRoomIds()) {
                if (roomId == null) {
                    return new ApiResponse(false, "Room ID cannot be null");
                }
                boolean available = bookingRepository.isRoomAvailable(
                    roomId,
                    request.getCheckInDate(),
                    request.getCheckOutDate()
                );

                if (!available) {
                    return new ApiResponse(false, "Room " + roomId + " is already booked for the selected dates");
                }
            }

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
    public void markBookingReviewed(int bookingId) {
        bookingRepository.markBookingReviewed(bookingId);
    }
}
