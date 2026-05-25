package com.hotel.booking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.service.UserService;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
   
    private final UserService userService;

    public UserController (UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/by-username/{userName}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String userName){
        UserDTO user = userService.getUser(userName);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * DELETE /api/v1/users/{userId} - Xóa user
     * Response: 204 No Content
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/v1/users/{userId}/lock - Khóa/ban user
     * Request Body: { "reason": "reason text" }
     * Response: 200 OK với user object đã update
     */
    @PutMapping("/{userId}/lock")
    public ResponseEntity<UserDTO> banUser(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Banned by admin");
        UserDTO user = userService.banUser(userId, reason);
        return ResponseEntity.ok(user);
    }

    /**
     * POST /api/v1/users/{userId}/warn - Gửi cảnh báo cho user
     * Request Body: { "message": "warning message" }
     * Response: 200 OK
     */
    @PostMapping("/{userId}/warn")
    public ResponseEntity<UserDTO> warnUser(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> body) {
        String message = body.getOrDefault("message", "Warning from admin");
        UserDTO user = userService.warnUser(userId, message);
        return ResponseEntity.ok(user);
    }

    /**
     * PUT /api/v1/users/{userId}/role - Thay đổi role của user
     * Request Body: { "role": "STAFF" }
     * Response: 200 OK với user object đã update
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<UserDTO> grantStaffRole(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> body) {
        String role = body.getOrDefault("role", "STAFF");
        UserDTO user = userService.updateUserRole(userId, role);
        return ResponseEntity.ok(user);
    }
}
 
