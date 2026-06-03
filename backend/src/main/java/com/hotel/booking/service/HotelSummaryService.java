package com.hotel.booking.service;

import com.hotel.booking.repository.HotelSummaryRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class HotelSummaryService {

    private final HotelSummaryRepository summaryRepository;

    public HotelSummaryService(HotelSummaryRepository summaryRepository) {
        this.summaryRepository = summaryRepository;
    }

    public void updateHotelRatingSummary(int branchId) {
        Map<String, Object> summary = summaryRepository.getSummaryData(branchId);
        summaryRepository.saveSummary(branchId, summary);
    }
}
