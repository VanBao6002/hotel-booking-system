package com.hotel.booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "room_number", nullable = false)
    private Integer roomNumber;
    
    @Column(name = "floor", nullable = false)
    private Integer floor;
    
    @Column(name = "area", nullable = false)
    private String area;
    
    @Column(name = "number_of_bed", nullable = false)
    private Integer numberOfBed;
    
    @Column(name = "price", nullable = false)
    private Long price;
    
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "room_img", nullable = false, columnDefinition = "TEXT")
    private String roomImg;
    
    @Column(name = "hotel_branch_id")
    private Integer hotelBranchId;
    
    @ManyToOne
    @JoinColumn(name = "hotel_branch_id", insertable = false, updatable = false)
    private HotelBranch hotelBranch;
    
    @Column(name = "type_room_id")
    private Integer typeRoomId;
    
    @ManyToOne
    @JoinColumn(name = "type_room_id", insertable = false, updatable = false)
    private TypeRoom typeRoom;
    
    @Column(name = "room_status_id")
    private Integer roomStatusId;
    
    @ManyToOne
    @JoinColumn(name = "room_status_id", insertable = false, updatable = false)
    private RoomStatus roomStatus;

    public Room() {}

    public Room(Integer roomNumber, Integer floor, String area, Integer numberOfBed, 
                Long price, String description, String roomImg, Integer hotelBranchId,
                Integer typeRoomId, Integer roomStatusId) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.area = area;
        this.numberOfBed = numberOfBed;
        this.price = price;
        this.description = description;
        this.roomImg = roomImg;
        this.hotelBranchId = hotelBranchId;
        this.typeRoomId = typeRoomId;
        this.roomStatusId = roomStatusId;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getRoomNumber() { return roomNumber; }
    public void setRoomNumber(Integer roomNumber) { this.roomNumber = roomNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public Integer getNumberOfBed() { return numberOfBed; }
    public void setNumberOfBed(Integer numberOfBed) { this.numberOfBed = numberOfBed; }

    public Long getPrice() { return price; }
    public void setPrice(Long price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRoomImg() { return roomImg; }
    public void setRoomImg(String roomImg) { this.roomImg = roomImg; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public HotelBranch getHotelBranch() { return hotelBranch; }
    public void setHotelBranch(HotelBranch hotelBranch) { this.hotelBranch = hotelBranch; }

    public Integer getTypeRoomId() { return typeRoomId; }
    public void setTypeRoomId(Integer typeRoomId) { this.typeRoomId = typeRoomId; }

    public TypeRoom getTypeRoom() { return typeRoom; }
    public void setTypeRoom(TypeRoom typeRoom) { this.typeRoom = typeRoom; }

    public Integer getRoomStatusId() { return roomStatusId; }
    public void setRoomStatusId(Integer roomStatusId) { this.roomStatusId = roomStatusId; }

    public RoomStatus getRoomStatus() { return roomStatus; }
    public void setRoomStatus(RoomStatus roomStatus) { this.roomStatus = roomStatus; }
}
