package com.hotel.booking.controller;

import com.hotel.booking.dto.HotelReviewDTO;
import com.hotel.booking.dto.HotelReviewResponse;
import com.hotel.booking.service.HotelReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class HotelReviewController {

    private final HotelReviewService reviewService;

    public HotelReviewController(HotelReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Lấy tất cả review theo hotel_branch_id
    @GetMapping("/hotel/{hotelBranchId}")
    public ResponseEntity<HotelReviewResponse> getHotelReviews(@PathVariable int hotelBranchId) {
        HotelReviewResponse response = reviewService.getHotelReviewSummary(hotelBranchId);
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách review chi tiết (nếu muốn tách riêng)
    @GetMapping("/hotel/{hotelBranchId}/list")
    public ResponseEntity<List<HotelReviewDTO>> getReviewList(@PathVariable int hotelBranchId) {
        List<HotelReviewDTO> reviews = reviewService.getReviewsByHotelBranchId(hotelBranchId);
        return ResponseEntity.ok(reviews);
    }

    // // Thêm review mới
    // @PostMapping("/hotel/{hotelBranchId}")
    // public ResponseEntity<String> addReview(@PathVariable int hotelBranchId,
    //                                         @RequestBody HotelReviewDTO review) {
    //     review.setHotelBranchId(hotelBranchId);
    //     int rows = reviewService.addReview(review);
    //     if (rows > 0) {
    //         return ResponseEntity.ok("Review added successfully");
    //     } else {
    //         return ResponseEntity.badRequest().body("Failed to add review");
    //     }
    // }
}
