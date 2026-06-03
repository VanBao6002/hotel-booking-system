package com.hotel.booking.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BookingRequest {

    @NotNull(message = "Check-in date cannot be null")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date cannot be null")
    private LocalDate checkOutDate;

    @NotNull(message = "Booking price cannot be null")
    @Positive(message = "Booking price must be greater than 0")
    private Long bookingPrice;

    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    @NotNull(message = "Hotel branch ID cannot be null")
    private Integer hotelBranchId;

    @NotNull(message = "Room IDs cannot be null")
    private List<Integer> roomIds; // danh sách phòng

    private Integer roomId;

    // Getters & Setters
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Long getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Long bookingPrice) { this.bookingPrice = bookingPrice; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public List<Integer> getRoomIds() { return roomIds; }
    public void setRoomIds(List<Integer> roomIds) { this.roomIds = roomIds; }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

}
