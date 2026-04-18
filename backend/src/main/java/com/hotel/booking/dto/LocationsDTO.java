package com.hotel.booking.dto;

public class LocationsDTO {
    private int id;
    private String location;

    // Constructor mặc định
    public LocationsDTO() {}

    // Constructor đầy đủ
    public LocationsDTO(int id, String location) {
        this.id = id;
        this.location = location;
    }

    // Getter và Setter
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
}
