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
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setUserName(user.getUserName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setCurrentAddress(user.getCurrentAddress());
        dto.setLockedUntil(user.getLockedUntil());
        dto.setActive(user.getIsActive());
        dto.setRole(user.getRole().toApiRole());
            // Map genderId sang gender string
            Integer genderId = user.getGenderId();
            String gender = null;
            if (genderId != null) {
                switch (genderId) {
                    case 1 -> gender = "Nam";
                    case 2 -> gender = "Nữ";
                    default -> gender = "Khác";
                }
            }
            dto.setGender(gender);
        return dto;
    }
}
