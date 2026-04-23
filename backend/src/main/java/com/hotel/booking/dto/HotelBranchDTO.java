package com.hotel.booking.dto;

import java.util.ArrayList;
import java.util.List;           // để dùng List
public class HotelBranchDTO {
    private int id;
    private String address;
    private String phoneNumber;
    private String locationName;     // tên khu vực (join từ bảng location)
    private List<String> services; // thêm list service chung
    private List<RoomDTO> rooms; // thêm danh sách phòng
    

    public HotelBranchDTO() {}

    public HotelBranchDTO(int id, String address, String phoneNumber,String locationName, List<RoomDTO> rooms,List<String> services) {
        this.id = id;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.locationName = locationName;
        this.rooms = rooms;
        this.services = new ArrayList<>();
    }

    // Getter/Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public List<RoomDTO> getRooms() { return rooms; }
    public void setRooms(List<RoomDTO> rooms) { this.rooms = rooms; }
    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }
}
