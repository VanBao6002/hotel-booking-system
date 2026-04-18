package com.hotel.booking.dto;

import java.time.LocalDate;

import org.springframework.cglib.core.Local;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class SearchingHotel {
    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotBlank(message = "Check in date cannot be blank")
    private LocalDate checkInDate;

    @NotBlank(message = "Check out date cannot be blank")
    private LocalDate checkOutDate;

    private Integer doubleRoomQuantity;


    private Integer singleRoomQuantity;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
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

    public void  setDoubleRoomQuantity(Integer doubleRoomQuantity){
        this.doubleRoomQuantity = doubleRoomQuantity;
    }

    public Integer getSingleRoomQuantity() {
        return singleRoomQuantity;
    }

    public void setSingleRoomQuantity(Integer singleRoomQuantity) {
        this.singleRoomQuantity = singleRoomQuantity;
    }
}
