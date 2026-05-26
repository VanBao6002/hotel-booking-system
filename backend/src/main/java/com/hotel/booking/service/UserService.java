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
    public UserDTO getUser(String phoneNumber){
        // business ops
        User user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new ResourceNotFoundException("User not found: " + phoneNumber));
        return UserMapper.toDto(user);
    }

    public List<UserDTO> getAllUsers () {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toDto).toList();
    }

    public UserDTO updateProfile(String phoneNumber, UpdateProfileRequest request) {
        User user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + phoneNumber));

        String normalizedEmail = normalizeOptionalEmail(request.getEmail());
        String requestedPhoneNumber = request.getPhoneNumber();

        if (normalizedEmail != null && !normalizedEmail.equals(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new com.hotel.booking.exception.ConflictException("Email already exists");
        }

        if (requestedPhoneNumber != null && !requestedPhoneNumber.equals(user.getPhoneNumber()) && userRepository.existsByPhoneNumber(requestedPhoneNumber)) {
            throw new com.hotel.booking.exception.ConflictException("Phonenumber is claimed");
        }

        user.setEmail(normalizedEmail);
        user.setUserName(request.getUserName());
        user.setFullName(request.getFullName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGenderId(request.getGenderId());
        user.setPhoneNumber(requestedPhoneNumber);
        user.setCurrentAddress(request.getCurrentAddress());
        user.setCountryId(request.getCountryId());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        return UserMapper.toDto(savedUser);
    }

    private String normalizeOptionalEmail(String email) {
        if (email == null) {
            return null;
        }

        String normalizedEmail = email.trim();
        return normalizedEmail.isEmpty() ? null : normalizedEmail;
    }
}
