package com.hotel.booking.service;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.RoomDTO;
import com.hotel.booking.dto.SearchResponse;
import com.hotel.booking.repository.HotelBranchRepository;
import com.hotel.booking.repository.BookingRepository;

// import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
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
    public List<HotelBranchDTO> getAllHotelBranches() {
        return branchRepo.getAllHotelBranches();
    }

public SearchResponse searchAvailableHotelBranches(LocalDate checkInDate,
                                                    LocalDate checkOutDate,
                                                    int requiredSingleRooms,
                                                    int requiredDoubleRooms,
                                                    String locationName) {
    // Lấy chi nhánh theo location thay vì tất cả
    List<HotelBranchDTO> allBranches = branchRepo.getHotelBranchesByLocation(locationName);
    List<HotelBranchDTO> result = new ArrayList<>();

    for (HotelBranchDTO b : allBranches) {
        // gọi lại getBranchById để lấy chi nhánh đầy đủ (có rooms)
        HotelBranchDTO branch = branchRepo.getHotelBranchById(b.getId());

        List<RoomDTO> availableRooms = branch.getRooms().stream()
                .filter(room -> bookingRepo.isRoomAvailable(room.getId(), checkInDate, checkOutDate))
                .collect(Collectors.toList());

        long availableSingles = availableRooms.stream()
                .filter(r -> "SINGLE".equals(r.getTypeCode()))
                .count();

        long availableDoubles = availableRooms.stream()
                .filter(r -> "DOUBLE".equals(r.getTypeCode()))
                .count();

        if (availableSingles >= requiredSingleRooms && availableDoubles >= requiredDoubleRooms) {
            branch.setRooms(availableRooms);
            result.add(branch);
        }
    }

    // Nếu không có khách sạn nào thỏa mãn
if (result.isEmpty()) {
    return new SearchResponse(result, "Không có khách sạn nào thỏa mãn điều kiện tìm kiếm");
}
return new SearchResponse(result, "Tìm thấy " + result.size() + " khách sạn phù hợp");




}
}
