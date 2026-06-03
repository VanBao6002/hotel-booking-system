package com.hotel.booking.dto;

public class BookingRoomDTO {
    private int id;
    private int bookingId;
    private int roomId;

    // Thông tin chi tiết phòng
    private String roomNumber;
    private String roomImg;
    private String roomType;
    private Long roomPrice;

    public BookingRoomDTO() {}

    public BookingRoomDTO(int id, int bookingId, int roomId,
                          String roomNumber, String roomImg,
                          String roomType, Long roomPrice) {
        this.id = id;
        this.bookingId = bookingId;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomImg = roomImg;
        this.roomType = roomType;
        this.roomPrice = roomPrice;
    }

    // Getter & Setter
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }

    public int getRoomId() { return roomId; }
    public void setRoomId(int roomId) { this.roomId = roomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomImg() { return roomImg; }
    public void setRoomImg(String roomImg) { this.roomImg = roomImg; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Long getRoomPrice() { return roomPrice; }
    public void setRoomPrice(Long roomPrice) { this.roomPrice = roomPrice; }
}
