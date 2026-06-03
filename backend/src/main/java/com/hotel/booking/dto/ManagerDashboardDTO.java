package com.hotel.booking.dto;

import java.util.List;

public class ManagerDashboardDTO {
    private FinanceSummaryDTO financeSummary;
    private MonthlyRevenueDTO monthlyRevenue;
    private Integer totalBookings;
    private Integer activeBookings;
    private Integer totalUsers;
    private Integer totalRooms;
    private Integer activeBookedRooms;
    private Integer occupancyRate;
    private List<HotelBranchDTO> topHotels;
    private List<BookingDTO> recentBookings;

    public ManagerDashboardDTO() {
    }

    public ManagerDashboardDTO(
            FinanceSummaryDTO financeSummary,
            MonthlyRevenueDTO monthlyRevenue,
            Integer totalBookings,
            Integer activeBookings,
            Integer totalUsers,
            Integer totalRooms,
            Integer activeBookedRooms,
            Integer occupancyRate,
            List<HotelBranchDTO> topHotels,
            List<BookingDTO> recentBookings) {
        this.financeSummary = financeSummary;
        this.monthlyRevenue = monthlyRevenue;
        this.totalBookings = totalBookings;
        this.activeBookings = activeBookings;
        this.totalUsers = totalUsers;
        this.totalRooms = totalRooms;
        this.activeBookedRooms = activeBookedRooms;
        this.occupancyRate = occupancyRate;
        this.topHotels = topHotels;
        this.recentBookings = recentBookings;
    }

    public FinanceSummaryDTO getFinanceSummary() { return financeSummary; }
    public void setFinanceSummary(FinanceSummaryDTO financeSummary) { this.financeSummary = financeSummary; }

    public MonthlyRevenueDTO getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(MonthlyRevenueDTO monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }

    public Integer getActiveBookings() { return activeBookings; }
    public void setActiveBookings(Integer activeBookings) { this.activeBookings = activeBookings; }

    public Integer getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Integer totalUsers) { this.totalUsers = totalUsers; }

    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

    public Integer getActiveBookedRooms() { return activeBookedRooms; }
    public void setActiveBookedRooms(Integer activeBookedRooms) { this.activeBookedRooms = activeBookedRooms; }

    public Integer getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Integer occupancyRate) { this.occupancyRate = occupancyRate; }

    public List<HotelBranchDTO> getTopHotels() { return topHotels; }
    public void setTopHotels(List<HotelBranchDTO> topHotels) { this.topHotels = topHotels; }

    public List<BookingDTO> getRecentBookings() { return recentBookings; }
    public void setRecentBookings(List<BookingDTO> recentBookings) { this.recentBookings = recentBookings; }
}
