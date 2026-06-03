package com.hotel.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.ManagerDashboardDTO;
import com.hotel.booking.service.ManagerDashboardService;

@RestController
@RequestMapping("/api/v1/dashboard")
public class ManagerDashboardController {
    private final ManagerDashboardService dashboardService;

    public ManagerDashboardController(ManagerDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/manager")
    public ResponseEntity<ManagerDashboardDTO> getManagerDashboard(@RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(dashboardService.getDashboard(year));
    }
}
