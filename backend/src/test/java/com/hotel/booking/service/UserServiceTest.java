package com.hotel.booking.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.DatabaseSchemaInspector;
import com.hotel.booking.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private DatabaseSchemaInspector schemaInspector;

    @InjectMocks
    private UserService userService;

    @Test
    void deleteUserSoftDeletesAccountInsteadOfRemovingRecord() {
        User user = buildUser();
        user.setLockedUntil(LocalDateTime.now().plusDays(1));
        user.setFailedLoginAttempts(4);

        when(userRepository.findById(7)).thenReturn(Optional.of(user));

        userService.deleteUser(7);

        assertFalse(user.getIsActive());
        assertNull(user.getLockedUntil());
        verify(userRepository).save(user);
        verify(userRepository, never()).delete(user);
    }

    private User buildUser() {
        User user = new User();
        user.setId(7);
        user.setUserName("customer");
        user.setEmail("customer@example.com");
        user.setPasswordHash("encoded-password");
        user.setRole(Role.CUSTOMER);
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
}
