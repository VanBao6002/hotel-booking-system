package com.hotel.booking.dto;

public class RoomStatusDTO {
    private int id;
    private String status;

    // Constructor mặc định
    // public RoomStatusDTO() {}

    // // Constructor đầy đủ
    // public RoomStatusDTO(int id, String status) {
    //     this.id = id;
    //     this.status = status;
    // }

    // Getter và Setter
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
