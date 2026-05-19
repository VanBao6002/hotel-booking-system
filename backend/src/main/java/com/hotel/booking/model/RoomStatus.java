package com.hotel.booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roomstatus")
public class RoomStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "status", nullable = false, unique = true)
    private String status;

    public RoomStatus() {}

    public RoomStatus(Integer id, String status) {
        this.id = id;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
