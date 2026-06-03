package com.hotel.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.ChangePasswordRequest;
import com.hotel.booking.dto.ForgotPasswordRequest;
import com.hotel.booking.dto.ForgotPasswordResponse;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.LoginResponse;
import com.hotel.booking.dto.ProfileUpdateRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.dto.ResetPasswordRequest;
import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody RegisterRequest request) {
        UserDTO user = authService.register(request);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.noContent().build();
    } 

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
        @RequestHeader("Authorization") String authorizationHeader,
        @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(authorizationHeader, request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getUser(@RequestHeader("Authorization") String authorizationHeader
    ){
        UserDTO user = authService.me(authorizationHeader);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<UserDTO> updateProfile(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody ProfileUpdateRequest request
    ) {
        UserDTO user = authService.updateProfile(authorizationHeader, request);
        return ResponseEntity.ok(user);
    }

}
