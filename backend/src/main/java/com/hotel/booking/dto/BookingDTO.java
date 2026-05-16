package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BookingDTO {
    private String id;  // Format: "B-{bookingId}"
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookedAt;

    // Fields chung
    private String roomImg;
    private Integer hotelBranchId;
    private Integer roomId;

    // Fields từ mergeFrontEnd
    private Integer userId;          
    private Long bookingPrice;       

    // Fields từ FE_QuanLy (Admin panel)
    private String guestName;
    private String guestEmail;
    private String hotelName;
    private String roomType;
    private Integer numberOfNights;
    private Long pricePerNight;
    private Long totalPrice;
    private String paymentStatus;  // Paid, Pending, Partial
    private String bookingStatus;  // Confirmed, Pending, Completed, Cancelled

    // Constructor mặc định
    public BookingDTO() {}

    // Constructor đầy đủ
    public BookingDTO(int id, LocalDate checkInDate, LocalDate checkOutDate,
                      LocalDateTime bookedAt, String roomImg,
                      Integer hotelBranchId, Integer roomId,
                      Integer userId, Long bookingPrice) {
        this.id = "B-" + id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookedAt = bookedAt;
        this.roomImg = roomImg;
        this.hotelBranchId = hotelBranchId;
        this.roomId = roomId;
        this.userId = userId;
        this.bookingPrice = bookingPrice;
        this.numberOfNights = daysBetween(checkInDate, checkOutDate);
    }

    // Helper method để tính số đêm
    private static Integer daysBetween(LocalDate start, LocalDate end) {
        if (start != null && end != null) {
            return (int) java.time.temporal.ChronoUnit.DAYS.between(start, end);
        }
        return 0;
    }

    // Helper method để format dates thành "MMM dd - MMM dd"
    public String getFormattedDates() {
        if (checkInDate == null || checkOutDate == null) {
            return "";
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        return checkInDate.format(formatter) + " - " + checkOutDate.format(formatter);
    }

    // Getter & Setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }

    public String getRoomImg() { return roomImg; }
    public void setRoomImg(String roomImg) { this.roomImg = roomImg; }

    public Long getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Long bookingPrice) { this.bookingPrice = bookingPrice; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public Integer getRoomId() { return roomId; }
    public void setRoomId(Integer roomId) { this.roomId = roomId; }

    public String getGuestName() { return guestName; }
    public void setGuestName(String guestName) { this.guestName = guestName; }

    public String getGuestEmail() { return guestEmail; }
    public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Integer getNumberOfNights() { return numberOfNights; }
    public void setNumberOfNights(Integer numberOfNights) { this.numberOfNights = numberOfNights; }

    public Long getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Long pricePerNight) { this.pricePerNight = pricePerNight; }

    public Long getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Long totalPrice) { this.totalPrice = totalPrice; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }
}
