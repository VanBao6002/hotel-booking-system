package com.hotel.booking.dto;

import java.time.LocalDate;

public class TransactionDTO {
    private Integer id;
    private LocalDate date;
    private String description;
    private Long amount;
    private String status;  // Completed, Pending
    private String type;    // revenue, expense

    public TransactionDTO() {}

    public TransactionDTO(Integer id, LocalDate date, String description, Long amount, String status, String type) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.status = status;
        this.type = type;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
