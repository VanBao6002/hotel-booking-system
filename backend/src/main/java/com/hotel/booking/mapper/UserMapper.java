package com.hotel.booking.mapper;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.model.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserDTO toDto(User user) {
        if (user == null) {
            return null;
        }

        if (user.getRole() == null) {
            throw new IllegalStateException("User role must not be null");
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setUserName(user.getUserName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setCurrentAddress(user.getCurrentAddress());
        dto.setLockedUntil(user.getLockedUntil());
        dto.setRole(user.getRole().toApiRole());
        return dto;
    }
}  