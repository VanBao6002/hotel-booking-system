package com.hotel.booking.dto;

public class RoomDTO {
    private int id;
    private String area;
    private int numberOfBed;
    private String description;
    private String roomIMG;
    private Integer hotelBranchID;
    private Integer typeRoomID;
    private Integer locationID;
    private Integer roomStatusID;

    // Constructor mặc định
    public RoomDTO() {}

    // Constructor đầy đủ
    public RoomDTO(int id, String area, int numberOfBed, String description, String roomIMG,
                   Integer hotelBranchID, Integer typeRoomID, Integer locationID, Integer roomStatusID) {
        this.id = id;
        this.area = area;
        this.numberOfBed = numberOfBed;
        this.description = description;
        this.roomIMG = roomIMG;
        this.hotelBranchID = hotelBranchID;
        this.typeRoomID = typeRoomID;
        this.locationID = locationID;
        this.roomStatusID = roomStatusID;
    }

    // Getter và Setter
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getArea() {
        return area;
    }
    public void setArea(String area) {
        this.area = area;
    }

    public int getNumberOfBed() {
        return numberOfBed;
    }
    public void setNumberOfBed(int numberOfBed) {
        this.numberOfBed = numberOfBed;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getRoomIMG() {
        return roomIMG;
    }
    public void setRoomIMG(String roomIMG) {
        this.roomIMG = roomIMG;
    }

    public Integer getHotelBranchID() {
        return hotelBranchID;
    }
    public void setHotelBranchID(Integer hotelBranchID) {
        this.hotelBranchID = hotelBranchID;
    }

    public Integer getTypeRoomID() {
        return typeRoomID;
    }
    public void setTypeRoomID(Integer typeRoomID) {
        this.typeRoomID = typeRoomID;
    }

    public Integer getLocationID() {
        return locationID;
    }
    public void setLocationID(Integer locationID) {
        this.locationID = locationID;
    }

    public Integer getRoomStatusID() {
        return roomStatusID;
    }
    public void setRoomStatusID(Integer roomStatusID) {
        this.roomStatusID = roomStatusID;
    }
}

