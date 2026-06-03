package com.hotel.booking.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "booked_at", nullable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    @Column(name = "room_img", columnDefinition = "TEXT", nullable = false)
    private String roomIMG;
    
    @Column(name = "booking_price", nullable = false)
    private Long bookingPrice = 0L;   // thêm trường mới

    @Column(name = "reviewed", nullable = false)
    private Boolean reviewed = false;

    @Column(name = "user_id")
    private Integer userId;           // thêm trường mới

    @Column(name = "hotel_branch_id")
    private Integer hotelBranchId;

    @Column(name = "room_id")
    private Integer roomId;

    // Getters & Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public String getRoomIMG() {
        return roomIMG;
    }

    public void setRoomIMG(String roomIMG) {
        this.roomIMG = roomIMG;
    }
    public Long getBookingPrice() {
        return bookingPrice;
    }
    public void setBookingPrice(Long bookingPrice) {
        this.bookingPrice = bookingPrice;
    }

    public Boolean getReviewed() {
        return reviewed;
    }

    public void setReviewed(Boolean reviewed) {
        this.reviewed = reviewed;
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public Integer getHotelBranchId() {
        return hotelBranchId;
    }

    public void setHotelBranchId(Integer hotelBranchId) {
        this.hotelBranchId = hotelBranchId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }
}
