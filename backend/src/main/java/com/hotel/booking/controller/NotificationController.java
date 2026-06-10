package com.hotel.booking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.NotificationDTO;
import com.hotel.booking.service.JwtService;
import com.hotel.booking.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtService jwtService;

    public NotificationController(NotificationService notificationService, JwtService jwtService) {
        this.notificationService = notificationService;
        this.jwtService = jwtService;
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @RequestHeader("Authorization") String authorizationHeader) {
        Integer userId = extractUserId(authorizationHeader);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer notificationId) {
        Integer userId = extractUserId(authorizationHeader);
        notificationService.markAsRead(userId, notificationId);
        return ResponseEntity.noContent().build();
    }

    private Integer extractUserId(String authorizationHeader) {
        String token = jwtService.extractBearerToken(authorizationHeader);
        return jwtService.extractUserId(token);
    }
}
