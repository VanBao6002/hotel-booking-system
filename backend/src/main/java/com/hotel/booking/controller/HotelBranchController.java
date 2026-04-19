package com.hotel.booking.controller;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.dto.SearchingHotel;
import com.hotel.booking.service.HotelBranchService;
import org.springframework.web.bind.annotation.*;

// import java.sql.SQLException;
// import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class HotelBranchController {

    private final HotelBranchService branchService;

    public HotelBranchController(HotelBranchService branchService) {
        this.branchService = branchService;
    }
@PostMapping("/hotel")
public List<HotelBranchDTO> searchHotels(@RequestBody SearchingHotel request) {
    List<HotelBranchDTO> result = new ArrayList<>();
    List<HotelBranchDTO> allBranches = branchService.getAllBranches();

    for (HotelBranchDTO branch : allBranches) {
        try {
            HotelBranchDTO availableBranch = branchService.searchAvailableBranch(
                    branch.getId(),
                    request.getCheckInDate(),
                    request.getCheckOutDate(),
                    request.getSingleRoomQuantity(),
                    request.getDoubleRoomQuantity()
            );
            result.add(availableBranch);
        } catch (IllegalArgumentException e) {
            // bỏ qua chi nhánh không đủ phòng
        }
    }
    return result;
}


    /**
     * API tìm tất cả chi nhánh đáp ứng yêu cầu tìm kiếm
     */
//     @GetMapping("/hotels")
//     public List<HotelBranchDTO> searchHotels(
//             @RequestParam LocalDate checkInDate,
//             @RequestParam LocalDate checkOutDate,
//             @RequestParam int requiredSingleRooms,
//             @RequestParam int requiredDoubleRooms) throws SQLException {

//         List<HotelBranchDTO> result = new ArrayList<>();

//         // Lấy tất cả chi nhánh từ DB
//         List<HotelBranchDTO> allBranches = branchService.getAllBranches();

//         // Duyệt từng chi nhánh và kiểm tra điều kiện
//         for (HotelBranchDTO branch : allBranches) {
//             try {
//                 HotelBranchDTO availableBranch = branchService.searchAvailableBranch(
//                         branch.getId(),
//                         checkInDate,
//                         checkOutDate,
//                         requiredSingleRooms,
//                         requiredDoubleRooms
//                 );
//                 result.add(availableBranch);
//             } catch (IllegalArgumentException e) {
//                 // Nếu chi nhánh không đủ phòng thì bỏ qua
//             }
//         }

//         return result; // trả về danh sách chi nhánh đáp ứng yêu cầu
//     }
}
