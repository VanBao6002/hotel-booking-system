package com.hotel.booking.dto;

import java.util.List;           // để dùng List
public class HotelBranchDTO {
    private int id;
    private String address;
    private String phoneNumber;
    private List<RoomDTO> rooms; // thêm danh sách phòng

    public HotelBranchDTO() {}

    public HotelBranchDTO(int id, String address, String phoneNumber, List<RoomDTO> rooms) {
        this.id = id;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.rooms = rooms;
    }

    // Getter/Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public List<RoomDTO> getRooms() { return rooms; }
    public void setRooms(List<RoomDTO> rooms) { this.rooms = rooms; }
}
