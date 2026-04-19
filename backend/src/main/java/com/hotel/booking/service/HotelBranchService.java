package com.hotel.booking.service;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.repository.HotelBranchRepository;
import com.hotel.booking.repository.BookingRepository;

// import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
@Service
public class HotelBranchService {
    private final HotelBranchRepository branchRepo;
    private final BookingRepository bookingRepo;

    public HotelBranchService(HotelBranchRepository branchRepo, BookingRepository bookingRepo) {
        this.branchRepo = branchRepo;
        this.bookingRepo = bookingRepo;
    }

    // Không cần throws SQLException nữa
    public List<HotelBranchDTO> getAllBranches() {
        return branchRepo.getAllBranches();
    }

    public HotelBranchDTO searchAvailableBranch(int branchId,
                                                LocalDate checkInDate,
                                                LocalDate checkOutDate,
                                                int requiredSingleRooms,
                                                int requiredDoubleRooms) {
        HotelBranchDTO branch = branchRepo.getBranchById(branchId);
        if (branch == null) {
            throw new IllegalArgumentException("Không tìm thấy chi nhánh với ID: " + branchId);
        }

        List<RoomDTO> availableRooms = branch.getRooms().stream()
                .filter(room -> bookingRepo.isRoomAvailable(room.getId(), checkInDate, checkOutDate))
                .collect(Collectors.toList());

        long availableSingles = availableRooms.stream()
                .filter(r -> r.getTypeRoomID() == 1)
                .count();

        long availableDoubles = availableRooms.stream()
                .filter(r -> r.getTypeRoomID() == 2)
                .count();

        if (availableSingles < requiredSingleRooms || availableDoubles < requiredDoubleRooms) {
            throw new IllegalArgumentException("Không đủ phòng đáp ứng yêu cầu!");
        }

        branch.setRooms(availableRooms);
        return branch;
    }
}
