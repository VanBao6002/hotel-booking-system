package com.hotel.booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.service.UserService;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/api/v1/users/by-username/{userName}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String userName){
        UserDTO user = userService.getUser(userName);
        return ResponseEntity.ok(user);
    }
}
