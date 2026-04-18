package com.hotel.booking.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "checkInDate", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "checkOutDate", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "bookedAt", nullable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    @Column(name = "roomIMG", columnDefinition = "TEXT", nullable = false)
    private String roomIMG;

    @Column(name = "HotelBranchID")
    private Integer hotelBranchId;

    @Column(name = "RoomID")
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
