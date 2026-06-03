package com.hotel.booking.dto;

import java.time.LocalDate;

public class HotelReviewRequest {
    private int bookingId;       // thêm để biết review thuộc booking nào
    private int hotelBranchId;
    private int userId;
    private int rating;
    private String comment;
    private LocalDate createdAt;

    // Constructor mặc định
    public HotelReviewRequest() {}

    // Constructor đầy đủ
    public HotelReviewRequest(int bookingId, int hotelBranchId, int userId,
                              int rating, String comment, LocalDate createdAt) {
        this.bookingId = bookingId;
        this.hotelBranchId = hotelBranchId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getter & Setter
    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public int getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(int hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
