package com.hotel.booking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import com.hotel.booking.dto.UpdateProfileRequest;
import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
   
    private final UserService userService;

    public UserController (UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/by-phone-number/{phoneNumber}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String phoneNumber){
        UserDTO user = userService.getUser(phoneNumber);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update-profile/{phoneNumber}")
    public ResponseEntity<UserDTO> updateProfile(
            @PathVariable String phoneNumber,
            @RequestBody UpdateProfileRequest request) {
        
        UserDTO updatedUser = userService.updateProfile(phoneNumber, request);
        return ResponseEntity.ok(updatedUser);
    }
}
 