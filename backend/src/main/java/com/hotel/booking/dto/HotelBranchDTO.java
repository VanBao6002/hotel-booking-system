package com.hotel.booking.dto;

import java.util.ArrayList;
import java.util.List;

public class HotelBranchDTO {
    private Integer id;
    private String address;           // Hotel name (từ address hoặc thêm field)
    private String phoneNumber;
    private String locationName;     // Tên khu vực
    private Double averageStar;      // Rating
    private Integer roomCount;       // Số phòng
    private String imageUrl;         // Ảnh (optional)
    private Boolean isOnline;        // Trạng thái (optional)
    private List<String> services;   // Dịch vụ chung
    private List<RoomDTO> rooms;     // Danh sách phòng

    public HotelBranchDTO() {}

    public HotelBranchDTO(Integer id, String address, String phoneNumber, String locationName, 
                         Double averageStar, Integer roomCount) {
        this.id = id;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.locationName = locationName;
        this.averageStar = averageStar;
        this.roomCount = roomCount;
        this.rooms = new ArrayList<>();
        this.services = new ArrayList<>();
        this.isOnline = true;
    }

    // Getter/Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Double getAverageStar() { return averageStar; }
    public void setAverageStar(Double averageStar) { this.averageStar = averageStar; }

    public Integer getRoomCount() { return roomCount; }
    public void setRoomCount(Integer roomCount) { this.roomCount = roomCount; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public List<RoomDTO> getRooms() { return rooms; }
    public void setRooms(List<RoomDTO> rooms) { this.rooms = rooms; }
}
