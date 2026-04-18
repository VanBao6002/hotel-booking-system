package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {
    private int id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookedAt;
    private String roomIMG;
    private Integer hotelBranchID;
    private Integer roomID;

    // Constructor mặc định
    public BookingDTO() {}

    // Constructor đầy đủ
    public BookingDTO(int id, LocalDate checkInDate, LocalDate checkOutDate,
                      LocalDateTime bookedAt, String roomIMG,
                      Integer hotelBranchID, Integer roomID) {
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookedAt = bookedAt;
        this.roomIMG = roomIMG;
        this.hotelBranchID = hotelBranchID;
        this.roomID = roomID;
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

    public String getRoomIMG() { return roomIMG; }
    public void setRoomIMG(String roomIMG) { this.roomIMG = roomIMG; }

    public Integer getHotelBranchID() { return hotelBranchID; }
    public void setHotelBranchID(Integer hotelBranchID) { this.hotelBranchID = hotelBranchID; }

    public Integer getRoomID() { return roomID; }
    public void setRoomID(Integer roomID) { this.roomID = roomID; }
}
