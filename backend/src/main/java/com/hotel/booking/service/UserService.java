package com.hotel.booking.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
