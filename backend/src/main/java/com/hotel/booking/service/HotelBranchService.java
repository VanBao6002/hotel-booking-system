package com.hotel.booking.service;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.repository.HotelBranchRepository;
import com.hotel.booking.repository.BookingRepository;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class HotelBranchService {
    private final HotelBranchRepository branchRepo;
    private final BookingRepository bookingRepo;

    public HotelBranchService(HotelBranchRepository branchRepo, BookingRepository bookingRepo) {
        this.branchRepo = branchRepo;
        this.bookingRepo = bookingRepo;
    }

    /**
     * Tìm chi nhánh có đủ phòng trống theo ngày check-in/check-out và số lượng phòng đơn/đôi yêu cầu
     */
    public HotelBranchDTO searchAvailableBranch(int branchId,
                                                LocalDate checkInDate,
                                                LocalDate checkOutDate,
                                                int requiredSingleRooms,
                                                int requiredDoubleRooms) throws SQLException {
        // Lấy chi nhánh từ DB
        HotelBranchDTO branch = branchRepo.getBranchById(branchId);
        if (branch == null) {
            throw new IllegalArgumentException("Không tìm thấy chi nhánh với ID: " + branchId);
        }

        // Lọc danh sách phòng còn trống theo khoảng thời gian
        List<RoomDTO> availableRooms = branch.getRooms().stream()
                .filter(room -> {
                    try {
                        return bookingRepo.isRoomAvailable(room.getId(), checkInDate, checkOutDate);
                    } catch (SQLException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        // Đếm số lượng phòng đơn và phòng đôi
        long availableSingles = availableRooms.stream()
                .filter(r -> r.getTypeRoomID() == 1) // giả sử TypeRoomID=1 là phòng đơn
                .count();

        long availableDoubles = availableRooms.stream()
                .filter(r -> r.getTypeRoomID() == 2) // giả sử TypeRoomID=2 là phòng đôi
                .count();

        // Kiểm tra có đủ phòng không
        if (availableSingles < requiredSingleRooms || availableDoubles < requiredDoubleRooms) {
            throw new IllegalArgumentException("Không đủ phòng đáp ứng yêu cầu!");
        }

        // Gán danh sách phòng trống vào chi nhánh
        branch.setRooms(availableRooms);
        return branch;
    }
}
