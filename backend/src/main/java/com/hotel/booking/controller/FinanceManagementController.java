package com.hotel.booking.controller;

import com.hotel.booking.dto.FinanceSummaryDTO;
import com.hotel.booking.dto.MonthlyRevenueDTO;
import com.hotel.booking.dto.TransactionDTO;
import com.hotel.booking.service.FinanceManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Finance Management Admin APIs
 * Endpoints: /api/v1/finance
 */
@RestController
@RequestMapping("/api/v1/finance")
public class FinanceManagementController {
    
    @Autowired
    private FinanceManagementService financeService;

    /**
     * GET /api/v1/finance/summary - Lấy tóm tắt tài chính
     * Response: 200 OK với FinanceSummaryDTO
     */
    @GetMapping("/summary")
    public ResponseEntity<FinanceSummaryDTO> getFinanceSummary() {
        FinanceSummaryDTO summary = financeService.getFinanceSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/v1/finance/transactions - Lấy lịch sử giao dịch
     * Query params: page, pageSize, startDate, endDate
     * Response: 200 OK với List<TransactionDTO>
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getTransactions(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TransactionDTO> transactions = financeService.getTransactions(page, pageSize, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/v1/finance/monthly-revenue - Lấy doanh thu hàng tháng
     * Query params: year
     * Response: 200 OK với MonthlyRevenueDTO
     */
    @GetMapping("/monthly-revenue")
    public ResponseEntity<MonthlyRevenueDTO> getMonthlyRevenue(
            @RequestParam(required = false) Integer year) {
        MonthlyRevenueDTO revenue = financeService.getMonthlyRevenue(year);
        return ResponseEntity.ok(revenue);
    }
}
