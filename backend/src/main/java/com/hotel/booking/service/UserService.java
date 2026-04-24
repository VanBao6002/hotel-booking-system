package com.hotel.booking.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hotel.booking.dto.UpdateProfileRequest;
import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.mapper.UserMapper;
import com.hotel.booking.repository.UserRepository;

import com.hotel.booking.model.User;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    public UserDTO getUser(String userName){
        // business ops
        User user = userRepository.findByUserName(userName).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));
        return UserMapper.toDto(user);
    }

    public List<UserDTO> getAllUsers () {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toDto).toList();
    }

    public UserDTO updateProfile(String userName, UpdateProfileRequest request) {
    User user = userRepository.findByUserName(userName)
        .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));
    
    user.setFullName(request.getFullName());
    user.setDateOfBirth(request.getDateOfBirth());
    user.setGenderId(request.getGenderId());
    user.setPhoneNumber(request.getPhoneNumber());
    user.setCurrentAddress(request.getCurrentAddress());
    user.setCountryId(request.getCountryId());
    user.setUpdatedAt(LocalDateTime.now());
    
    User savedUser = userRepository.save(user);
    return UserMapper.toDto(savedUser);
}
}
