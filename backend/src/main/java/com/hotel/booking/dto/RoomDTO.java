package com.hotel.booking.dto;
import java.util.List;

public class RoomDTO {
    private int id;
    private int roomNumber;
    private int floor;
    private String area;
    private int numberOfBed;
    private Long price; // dùng Long
    private String description;
    private String roomIMG;
    private String hotelBranchAddress; // thay cho hotelBranchId
    private String typeCode;           // thay cho typeRoomId
    private String roomStatus;         // thay cho roomStatusId
    private List<String> services;   // thêm list service
    public RoomDTO() {}

    public RoomDTO(int id, int roomNumber, int floor, String area, int numberOfBed, Long price,
                   String description, String roomIMG, String hotelBranchAddress,
                   String typeCode, String roomStatus,List<String> services) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.area = area;
        this.numberOfBed = numberOfBed;
        this.description = description;
        this.roomIMG = roomIMG;
        this.hotelBranchAddress = hotelBranchAddress;
        this.typeCode = typeCode;
        this.roomStatus = roomStatus;
        this.services = services;
        this.price = price;
    }

    // Getter & Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }

    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public int getNumberOfBed() { return numberOfBed; }
    public void setNumberOfBed(int numberOfBed) { this.numberOfBed = numberOfBed; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRoomIMG() { return roomIMG; }
    public void setRoomIMG(String roomIMG) { this.roomIMG = roomIMG; }

    public String getHotelBranchAddress() { return hotelBranchAddress; }
    public void setHotelBranchAddress(String hotelBranchAddress) { this.hotelBranchAddress = hotelBranchAddress; }

    public String getTypeCode() { return typeCode; }
    public void setTypeCode(String typeCode) { this.typeCode = typeCode; }

    public String getRoomStatus() { return roomStatus; }
    public void setRoomStatus(String roomStatus) { this.roomStatus = roomStatus; }
    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public Long getPrice() {
        return price;
    }
    public void setPrice(Long price) {
        this.price = price;
    }
}

