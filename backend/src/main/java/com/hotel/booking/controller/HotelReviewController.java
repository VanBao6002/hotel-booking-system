package com.hotel.booking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.ApiResponse;
import com.hotel.booking.dto.HotelReviewDTO;
import com.hotel.booking.dto.HotelReviewRequest;
import com.hotel.booking.dto.HotelReviewResponse;
import com.hotel.booking.service.BookingService;
import com.hotel.booking.service.HotelReviewService;

@RestController
@RequestMapping("/api/reviews")
public class HotelReviewController {

    private final HotelReviewService reviewService;
    private final BookingService bookingService;

    public HotelReviewController(HotelReviewService reviewService, BookingService bookingService) {
        this.reviewService = reviewService;
        this.bookingService = bookingService;
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
    @PostMapping("/hotel/{hotelBranchId}")
    public ResponseEntity<ApiResponse> addReview(@PathVariable int hotelBranchId,
                                                 @RequestBody HotelReviewRequest request) {
        HotelReviewDTO dto = new HotelReviewDTO();
        dto.setHotelBranchId(hotelBranchId); // lấy từ path
        dto.setUserId(request.getUserId());
        dto.setRating(request.getRating());
        dto.setComment(request.getComment());
        dto.setCreatedAt(request.getCreatedAt());

        int rows = reviewService.addReview(dto);
        if (rows > 0) {
            // Sau khi thêm review thành công → đánh dấu booking đã được review
            bookingService.markBookingReviewed(request.getBookingId());
            return ResponseEntity.ok(new ApiResponse(true, "Review added successfully"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to add review"));
        }
    }
}
