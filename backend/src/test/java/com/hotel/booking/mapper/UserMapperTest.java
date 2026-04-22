package com.hotel.booking.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;

class UserMapperTest {

    @Test
    void toDtoReturnsNullWhenUserIsNull() {
        assertNull(UserMapper.toDto(null));
    }

    @Test
    void toDtoMapsRoleIdFromUser() {
        User user = new User();
        user.setRoleId(Role.ADMIN);

        UserDTO dto = UserMapper.toDto(user);

        assertEquals("ADMIN", dto.getRole());
    }

    @Test
    void toDtoThrowsWhenRoleIdIsNull() {
        User user = new User();
        user.setRoleId(null);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> UserMapper.toDto(user));

        assertEquals("User roleId must not be null", ex.getMessage());
    }

    @Test
    void toDtoThrowsWhenRoleIdIsUnknown() {
        User user = new User();
        user.setRoleId(99);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> UserMapper.toDto(user));

        assertEquals("Unsupported user roleId: 99", ex.getMessage());
    }
}
