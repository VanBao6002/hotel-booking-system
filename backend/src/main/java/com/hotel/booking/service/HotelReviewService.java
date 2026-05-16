package com.hotel.booking.service;

import com.hotel.booking.dto.HotelReviewDTO;
import com.hotel.booking.dto.HotelReviewResponse;
import com.hotel.booking.repository.HotelReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelReviewService {

    private final HotelReviewRepository reviewRepository;

    public HotelReviewService(HotelReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Lấy danh sách review theo hotel_branch_id
    public List<HotelReviewDTO> getReviewsByHotelBranchId(int hotelBranchId) {
        return reviewRepository.getReviewsByHotelBranchId(hotelBranchId);
    }

    // Lấy summary + list review
    public HotelReviewResponse getHotelReviewSummary(int hotelBranchId) {
        return reviewRepository.getHotelReviewSummary(hotelBranchId);
    }

    // // Thêm review mới
    // public int addReview(HotelReviewDTO review) {
    //     return reviewRepository.addReview(review);
    // }
}
