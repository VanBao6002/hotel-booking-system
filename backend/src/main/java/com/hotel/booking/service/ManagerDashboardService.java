package com.hotel.booking.service;

import java.time.Year;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hotel.booking.dto.BookingDTO;
import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.ManagerDashboardDTO;

@Service
public class ManagerDashboardService {
    private final FinanceManagementService financeService;
    private final HotelManagementService hotelService;
    private final BookingManagementService bookingService;
    private final UserService userService;

    public ManagerDashboardService(
            FinanceManagementService financeService,
            HotelManagementService hotelService,
            BookingManagementService bookingService,
            UserService userService) {
        this.financeService = financeService;
        this.hotelService = hotelService;
        this.bookingService = bookingService;
        this.userService = userService;
    }

    public ManagerDashboardDTO getDashboard(Integer year) {
        List<HotelBranchDTO> hotels = hotelService.getAllHotels();
        List<BookingDTO> bookings = bookingService.getAllBookings();
        int totalRooms = hotels.stream()
            .mapToInt(hotel -> hotel.getRoomCount() == null ? 0 : hotel.getRoomCount())
            .sum();
        List<BookingDTO> activeBookings = bookings.stream()
            .filter(this::isActiveBooking)
            .toList();
        int activeBookedRooms = activeBookings.stream()
            .mapToInt(this::roomCountForBooking)
            .sum();
        int occupancyRate = totalRooms == 0 ? 0 : Math.round((activeBookedRooms * 100f) / totalRooms);

        List<HotelBranchDTO> topHotels = hotels.stream()
            .sorted(Comparator.comparing(
                    (HotelBranchDTO hotel) -> hotel.getAverageStar() == null ? 0 : hotel.getAverageStar())
                .reversed())
            .limit(4)
            .toList();

        List<BookingDTO> recentBookings = bookings.stream()
            .limit(10)
            .toList();

        int selectedYear = year == null ? Year.now().getValue() : year;
        return new ManagerDashboardDTO(
            financeService.getFinanceSummary(),
            financeService.getMonthlyRevenue(selectedYear),
            bookings.size(),
            activeBookings.size(),
            userService.getAllUsers().size(),
            totalRooms,
            activeBookedRooms,
            occupancyRate,
            topHotels,
            recentBookings
        );
    }

    private boolean isActiveBooking(BookingDTO booking) {
        String status = booking.getBookingStatus() == null ? "" : booking.getBookingStatus().toLowerCase();
        return !"completed".equals(status) && !"cancelled".equals(status);
    }

    private int roomCountForBooking(BookingDTO booking) {
        if (booking.getBookingRooms() != null && !booking.getBookingRooms().isEmpty()) {
            return booking.getBookingRooms().size();
        }
        return booking.getRoomId() == null ? 0 : 1;
    }
}
