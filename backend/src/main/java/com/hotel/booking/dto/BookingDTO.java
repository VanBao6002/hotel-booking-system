package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BookingDTO {
    private int id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookedAt;
    private Long bookingPrice;
    private Integer userId;
    private Integer hotelBranchId;

    // Danh sách phòng thuộc booking này
    private List<BookingRoomDTO> bookingRooms;

    public BookingDTO() {}

    public BookingDTO(int id, LocalDate checkInDate, LocalDate checkOutDate,
                      LocalDateTime bookedAt, Long bookingPrice,
                      Integer userId, Integer hotelBranchId,
                      List<BookingRoomDTO> bookingRooms) {
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookedAt = bookedAt;
        this.bookingPrice = bookingPrice;
        this.userId = userId;
        this.hotelBranchId = hotelBranchId;
        this.bookingRooms = bookingRooms;
    }

    // Getter & Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }

    public Long getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Long bookingPrice) { this.bookingPrice = bookingPrice; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public List<BookingRoomDTO> getBookingRooms() { return bookingRooms; }
    public void setBookingRooms(List<BookingRoomDTO> bookingRooms) { this.bookingRooms = bookingRooms; }
}
