package com.hotel.booking.model;
import jakarta.persistence.*;

@Entity
@Table(name = "hotelbranch")
public class HotelBranch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "location_id")
    private Integer locationId;
    
    @ManyToOne
    @JoinColumn(name = "location_id", insertable = false, updatable = false)
    private Location location;
    
    @OneToMany(mappedBy = "hotelBranch", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Room> rooms;

    public HotelBranch() {}

    public HotelBranch(String address, String phoneNumber, Integer locationId) {
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.locationId = locationId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public java.util.List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(java.util.List<Room> rooms) {
        this.rooms = rooms;
    }
}