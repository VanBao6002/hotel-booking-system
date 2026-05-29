package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class BookingDTO {
    private String id;  // Format: "B-{bookingId}"
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDateTime bookedAt;

    // Fields chung
    // private String roomImg;
    private Integer roomId;
    private Integer hotelBranchId;
    private Integer bookingId;
    private Boolean reviewed; 

    // Danh sách phòng thuộc booking này
    private List<BookingRoomDTO> bookingRooms;

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

    public BookingDTO(int id, LocalDate checkInDate, LocalDate checkOutDate,
                  LocalDateTime bookedAt, Long bookingPrice,
                  Integer userId, Integer hotelBranchId,Boolean reviewed,
                  List<BookingRoomDTO> bookingRooms) {
        this.id = "B-" + id;
        this.bookingId = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookedAt = bookedAt;
        this.bookingPrice = bookingPrice;
        this.userId = userId;
        this.hotelBranchId = hotelBranchId;
        this.reviewed = reviewed;
        this.bookingRooms = bookingRooms;
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

    public Long getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Long bookingPrice) { this.bookingPrice = bookingPrice; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(Integer hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public List<BookingRoomDTO> getBookingRooms() { return bookingRooms; }
    public void setBookingRooms(List<BookingRoomDTO> bookingRooms) { this.bookingRooms = bookingRooms; }
    public Integer getRoomId() { return roomId; }
    public void setRoomId(Integer roomId) { this.roomId = roomId; }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

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

    public Boolean getReviewed() { return reviewed; }
    public void setReviewed(Boolean reviewed) { this.reviewed = reviewed; }
}
