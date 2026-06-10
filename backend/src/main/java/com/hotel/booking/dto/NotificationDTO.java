package com.hotel.booking.dto;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Integer id;
    private String message;
    private LocalDateTime createdAt;
    private String status;

    public NotificationDTO(Integer id, String message, LocalDateTime createdAt, String status) {
        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getStatus() {
        return status;
    }
}
