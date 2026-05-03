package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {
    private int id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookedAt;
    private String roomImg;
    private Long bookingPrice;       // thêm trường mới
    private Integer userId;          // thêm trường mới
    private Integer hotelBranchId;
    private Integer roomId;

    // Constructor mặc định
    public BookingDTO() {}

    // Constructor đầy đủ
    public BookingDTO(int id, LocalDate checkInDate, LocalDate checkOutDate,
                      LocalDateTime bookedAt, String roomImg,
                      Integer hotelBranchId, Integer roomId,
                      Integer userId, Long bookingPrice) {
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookedAt = bookedAt;
        this.roomImg = roomImg;
        this.hotelBranchId = hotelBranchId;
        this.roomId = roomId;
        this.userId = userId;
        this.bookingPrice = bookingPrice;
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
