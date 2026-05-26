package com.hotel.booking.dto;

import java.util.List;

public class StaffDashboardDTO {
    private Integer hotelBranchId;
    private HotelBranchDTO hotel;
    private List<RoomDTO> rooms;
    private List<BookingDTO> recentBookings;
    private Integer totalRooms;
    private Integer availableRooms;
    private Integer bookedRooms;
    private Integer maintenanceRooms;
    private Integer totalBookings;
    private Integer activeBookings;
    private Integer todayCheckIns;
    private Integer todayCheckOuts;

    public Integer getHotelBranchId() {
        return hotelBranchId;
    }

    public void setHotelBranchId(Integer hotelBranchId) {
        this.hotelBranchId = hotelBranchId;
    }

    public HotelBranchDTO getHotel() {
        return hotel;
    }

    public void setHotel(HotelBranchDTO hotel) {
        this.hotel = hotel;
    }

    public List<RoomDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomDTO> rooms) {
        this.rooms = rooms;
    }

    public List<BookingDTO> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingDTO> recentBookings) {
        this.recentBookings = recentBookings;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Integer getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(Integer availableRooms) {
        this.availableRooms = availableRooms;
    }

    public Integer getBookedRooms() {
        return bookedRooms;
    }

    public void setBookedRooms(Integer bookedRooms) {
        this.bookedRooms = bookedRooms;
    }

    public Integer getMaintenanceRooms() {
        return maintenanceRooms;
    }

    public void setMaintenanceRooms(Integer maintenanceRooms) {
        this.maintenanceRooms = maintenanceRooms;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Integer getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(Integer activeBookings) {
        this.activeBookings = activeBookings;
    }

    public Integer getTodayCheckIns() {
        return todayCheckIns;
    }

    public void setTodayCheckIns(Integer todayCheckIns) {
        this.todayCheckIns = todayCheckIns;
    }

    public Integer getTodayCheckOuts() {
        return todayCheckOuts;
    }

    public void setTodayCheckOuts(Integer todayCheckOuts) {
        this.todayCheckOuts = todayCheckOuts;
    }
}
