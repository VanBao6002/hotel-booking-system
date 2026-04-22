package com.hotel.booking.mapper;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserDTO toDto(User user) {
        if (user == null) {
            return null;
        }

        if (user.getRoleId() == null) {
            throw new IllegalStateException("User roleId must not be null");
        }

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setCurrentAddress(user.getCurrentAddress());
        dto.setLockedUntil(user.getLockedUntil());
        dto.setRole(mapRole(user.getRoleId()));
        return dto;
    }

    private static String mapRole(Integer roleId) {
        if (Integer.valueOf(Role.ADMIN).equals(roleId)) {
            return "ADMIN";
        }

        if (Integer.valueOf(Role.USER).equals(roleId)) {
            return "USER";
        }

        throw new IllegalStateException("Unsupported user roleId: " + roleId);
    }
}  