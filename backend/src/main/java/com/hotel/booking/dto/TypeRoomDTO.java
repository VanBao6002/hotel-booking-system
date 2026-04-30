package com.hotel.booking.dto;

public class TypeRoomDTO {
    private int id;
    private String type;

    // // Constructor mặc định
    // public TypeRoomDTO() {}

    // // Constructor đầy đủ
    // public TypeRoomDTO(int id, String type) {
    //     this.id = id;
    //     this.type = type;
    // }

    // Getter và Setter
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
