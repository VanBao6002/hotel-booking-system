package com.hotel.booking.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hotel.booking.dto.ChangePasswordRequest;
import com.hotel.booking.dto.ForgotPasswordRequest;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.LoginResponse;
import com.hotel.booking.dto.ResetPasswordRequest;
import com.hotel.booking.exception.ConflictException;
import com.hotel.booking.exception.UnauthorizedException;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    private static final String LOGIN_IDENTIFIER = "0909000000";

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequest();
        loginRequest.setPhoneNumberOrEmail(LOGIN_IDENTIFIER);
        loginRequest.setPassword("plain-password");
    }

    @Test
    void loginLocksAccountAfterMaxFailedAttempts() {
        User user = buildUser();
        user.setFailedLoginAttempts(4);

        when(userRepository.findByPhoneNumberOrEmail(LOGIN_IDENTIFIER, LOGIN_IDENTIFIER)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", "encoded-password")).thenReturn(false);

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));

        assertEquals("Phone number or email or password not match", ex.getMessage());
        assertEquals(5, user.getFailedLoginAttempts());
        assertNotNull(user.getLockedUntil());
        verify(userRepository).save(user);
    }

    @Test
    void loginRejectsWhenAccountIsLocked() {
        User user = buildUser();
        user.setLockedUntil(LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByPhoneNumberOrEmail(LOGIN_IDENTIFIER, LOGIN_IDENTIFIER)).thenReturn(Optional.of(user));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));

        assertEquals("Account is locked. Please try again later", ex.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void loginRejectsWhenAccountIsDisabled() {
        User user = buildUser();
        user.setIsActive(false);

        when(userRepository.findByPhoneNumberOrEmail(LOGIN_IDENTIFIER, LOGIN_IDENTIFIER)).thenReturn(Optional.of(user));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(loginRequest));

        assertEquals("Account is disabled. Please try again later", ex.getMessage());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void loginResetsFailureStateAndReturnsTokenOnSuccess() {
        User user = buildUser();
        user.setFailedLoginAttempts(3);
        user.setLockedUntil(LocalDateTime.now().minusMinutes(1));

        when(userRepository.findByPhoneNumberOrEmail(LOGIN_IDENTIFIER, LOGIN_IDENTIFIER)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", "encoded-password")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access-token");
        when(jwtService.getAccessTokenExpiresInSeconds()).thenReturn(3600L);

        LoginResponse response = authService.login(loginRequest);

        assertEquals("access-token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(3600L, response.getExpiresIn());
        assertEquals(0, user.getFailedLoginAttempts());
        assertNull(user.getLockedUntil());
        assertNotNull(user.getLastLoginAt());
        verify(userRepository).save(user);
    }

    @Test
    void forgotPasswordGeneratesTokenOnlyForExistingEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();

        User user = buildUser();
        user.setEmail("user@example.com");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        authService.forgotPassword(request);
        verify(jwtService).generateResetPasswordToken(user);

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());
        authService.forgotPassword(request);
        verify(jwtService, times(1)).generateResetPasswordToken(any(User.class));
    }

    @Test
    void resetPasswordRejectsWhenNewPasswordEqualsCurrentPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setNewPassword("new-password");

        User user = buildUser();
        user.setEmail("user@example.com");

        when(jwtService.extractEmailFromResetToken("reset-token")).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("new-password", "encoded-password")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.resetPassword(request));

        assertEquals("New password must be different from current password", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePasswordUpdatesPasswordHashWhenCurrentPasswordIsCorrect() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("current-password");
        request.setNewPassword("new-password");

        User user = buildUser();

        when(jwtService.extractBearerToken("Bearer token")).thenReturn("token");
        when(jwtService.extractSubject("token")).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current-password", "encoded-password")).thenReturn(true);
        when(passwordEncoder.matches("new-password", "encoded-password")).thenReturn(false);
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");

        authService.changePassword("Bearer token", request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("new-hash", userCaptor.getValue().getPasswordHash());
    }

    private User buildUser() {
        User user = new User();
        user.setId(1);
        user.setEmail("user@example.com");
        user.setPhoneNumber(LOGIN_IDENTIFIER);
        user.setPasswordHash("encoded-password");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return user;
    }
}
