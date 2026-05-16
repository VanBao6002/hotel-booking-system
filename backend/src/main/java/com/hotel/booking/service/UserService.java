package com.hotel.booking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.mapper.UserMapper;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public UserDTO getUser(String userName) {
        User user = userRepository.findByUserName(userName)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));
        return UserMapper.toDto(user);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toDto).toList();
    }

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        userRepository.delete(user);
    }

    @Transactional
    public UserDTO banUser(Integer userId, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setLockedUntil(LocalDateTime.now().plusDays(7));
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return UserMapper.toDto(saved);
    }

    @Transactional
    public UserDTO warnUser(Integer userId, String message) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Integer unreadStatusId = jdbcTemplate.query(
                "SELECT id FROM notificationstatus WHERE LOWER(status) = LOWER(?) LIMIT 1",
                (rs, rowNum) -> rs.getInt("id"),
                "Unread")
            .stream()
            .findFirst()
            .orElse(null);

        jdbcTemplate.update(
            "INSERT INTO notification(message, createAt, isBroadcast, UserID, NotificationStatusID) VALUES (?, NOW(), FALSE, ?, ?)",
            message,
            userId,
            unreadStatusId
        );

        return UserMapper.toDto(user);
    }

    @Transactional
    public UserDTO grantStaffRole(Integer userId) {
        return updateUserRole(userId, Role.STAFF.toApiRole());
    }

    @Transactional
    public UserDTO updateUserRole(Integer userId, String roleName) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Role role = parseRole(roleName);
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        if (role == Role.STAFF) {
            jdbcTemplate.update(
                "INSERT INTO staff(UserID, HotelBranchID) " +
                "SELECT ?, NULL WHERE NOT EXISTS (SELECT 1 FROM staff WHERE UserID = ?)",
                userId,
                userId
            );
        }

        return UserMapper.toDto(saved);
    }

    private Role parseRole(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new IllegalArgumentException("Role is required");
        }

        try {
            return Role.valueOf(roleName.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported role: " + roleName);
        }
    }
}
