package com.hotel.booking.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.mapper.UserMapper;
import com.hotel.booking.repository.UserRepository;

public class BookingService {
    @Autowired
    UserRepository userRepository;
    public UserDTO searchingHotel(String userName){
        // business ops
        User user = userRepository.findByUserName(userName).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));
        return UserMapper.toDto(user);
    }

    public List<UserDTO> getAllUsers () {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toDto).toList();
    }
}
