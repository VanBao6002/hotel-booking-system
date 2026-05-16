package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Check-in date cannot be null")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date cannot be null")
    private LocalDate checkOutDate;

    @NotBlank(message = "Room image cannot be blank")
    private String roomImg;

    @NotNull(message = "Booking price cannot be null")
    @Positive(message = "Booking price must be greater than 0")
    private Long bookingPrice;

    @NotNull(message = "User ID cannot be null")
    private Integer userId;

    @NotNull(message = "Hotel branch ID cannot be null")
    private Integer hotelBranchId;

    @NotNull(message = "Room ID cannot be null")
    private Integer roomId;

    // Getters & Setters
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public String getRoomImg() { return roomImg; }
    public void setRoomImg(String roomImg) { this.roomImg = roomImg; }

    public Long getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Long bookingPrice) { this.bookingPrice = bookingPrice; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public Integer getRoomId() { return roomId; }
    public void setRoomId(Integer roomId) { this.roomId = roomId; }
}
