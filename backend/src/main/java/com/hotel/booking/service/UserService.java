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
import com.hotel.booking.repository.DatabaseSchemaInspector;
import com.hotel.booking.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DatabaseSchemaInspector schemaInspector;

    public UserDTO getUser(String userName) {
        User user = userRepository.findByUserName(userName)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));
        return enrichUserDto(UserMapper.toDto(user));
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserMapper::toDto).map(this::enrichUserDto).toList();
    }

    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setIsActive(false);
        user.setLockedUntil(null);
        user.setFailedLoginAttempts(0);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        persistLockReason(userId, "Account disabled by manager");
    }

    @Transactional
    public UserDTO banUser(Integer userId, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setLockedUntil(LocalDateTime.now().plusDays(7));
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        persistLockReason(userId, reason);
        createUserNotification(userId, "Account locked: " + reason);
        return enrichUserDto(UserMapper.toDto(saved));
    }

    @Transactional
    public UserDTO warnUser(Integer userId, String message) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        createUserNotification(userId, message);

        return enrichUserDto(UserMapper.toDto(user));
    }

    @Transactional
    public UserDTO grantStaffRole(Integer userId) {
        return updateUserRole(userId, Role.STAFF.toApiRole());
    }

    @Transactional
    public UserDTO updateUserRole(Integer userId, String roleName) {
        return updateUserRole(userId, roleName, null);
    }

    @Transactional
    public UserDTO updateUserRole(Integer userId, String roleName, Integer hotelBranchId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Role role = parseRole(roleName);
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        if (role == Role.STAFF) {
            Integer resolvedHotelBranchId = resolveStaffHotelBranchId(userId, hotelBranchId);
            jdbcTemplate.update(
                "INSERT INTO staff(UserID, HotelBranchID) " +
                "SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM staff WHERE UserID = ?)",
                userId,
                resolvedHotelBranchId,
                userId
            );
            jdbcTemplate.update(
                "UPDATE staff SET HotelBranchID = ? WHERE UserID = ?",
                resolvedHotelBranchId,
                userId,
                userId
            );
        } else {
            jdbcTemplate.update("DELETE FROM staff WHERE UserID = ?", userId);
        }

        return enrichUserDto(UserMapper.toDto(saved));
    }

    private Role parseRole(String roleName) {
        return Role.fromName(roleName);
    }

    private void createUserNotification(Integer userId, String message) {
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
    }

    private void persistLockReason(Integer userId, String reason) {
        if (schemaInspector.columnExists("users", "lock_reason")) {
            jdbcTemplate.update("UPDATE users SET lock_reason = ? WHERE id = ?", reason, userId);
        }
    }

    private UserDTO enrichUserDto(UserDTO dto) {
        if (dto == null || dto.getId() == null) {
            return dto;
        }

        if (schemaInspector.columnExists("users", "lock_reason")) {
            List<String> reasons = jdbcTemplate.query(
                "SELECT lock_reason FROM users WHERE id = ?",
                (rs, rowNum) -> rs.getString("lock_reason"),
                dto.getId()
            );
            if (!reasons.isEmpty()) {
                dto.setLockReason(reasons.get(0));
            }
        }

        if (schemaInspector.tableExists("staff")) {
            List<Integer> branchIds = jdbcTemplate.query(
                "SELECT HotelBranchID FROM staff WHERE UserID = ?",
                (rs, rowNum) -> {
                    int value = rs.getInt("HotelBranchID");
                    return rs.wasNull() ? null : value;
                },
                dto.getId()
            );
            if (!branchIds.isEmpty()) {
                dto.setStaffHotelBranchId(branchIds.get(0));
            }
        }

        return dto;
    }

    private Integer resolveStaffHotelBranchId(Integer userId, Integer requestedHotelBranchId) {
        if (requestedHotelBranchId != null) {
            return requestedHotelBranchId;
        }

        List<Integer> existing = jdbcTemplate.query(
            "SELECT HotelBranchID FROM staff WHERE UserID = ? AND HotelBranchID IS NOT NULL LIMIT 1",
            (rs, rowNum) -> rs.getInt("HotelBranchID"),
            userId
        );
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        List<Integer> firstHotel = jdbcTemplate.query(
            "SELECT id FROM hotelbranch ORDER BY id LIMIT 1",
            (rs, rowNum) -> rs.getInt("id")
        );
        return firstHotel.isEmpty() ? null : firstHotel.get(0);
    }
}
