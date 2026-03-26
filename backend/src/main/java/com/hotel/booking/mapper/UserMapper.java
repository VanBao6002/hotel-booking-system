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

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}