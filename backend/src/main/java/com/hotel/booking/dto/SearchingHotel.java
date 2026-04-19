package com.hotel.booking.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SearchingHotel {
    @NotBlank(message = "Location cannot be blank")
    private Integer location;

    @NotNull(message = "Check in date cannot be null")
    private LocalDate checkInDate;

    @NotNull(message = "Check out date cannot be null")
    private LocalDate checkOutDate;

    private Integer doubleRoomQuantity;
    private Integer singleRoomQuantity;

    // Getters & Setters
    public Integer getLocation() {
        return location;
    }
    public void setLocation(Integer location) {
        this.location = location;
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

    public Integer getDoubleRoomQuantity() {
        return doubleRoomQuantity;
    }
    public void setDoubleRoomQuantity(Integer doubleRoomQuantity) {
        this.doubleRoomQuantity = doubleRoomQuantity;
    }

    public Integer getSingleRoomQuantity() {
        return singleRoomQuantity;
    }
    public void setSingleRoomQuantity(Integer singleRoomQuantity) {
        this.singleRoomQuantity = singleRoomQuantity;
    }
}
