package com.hotel.booking.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.LoginResponse;
import com.hotel.booking.dto.ProfileUpdateRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.dto.ChangePasswordRequest;
import com.hotel.booking.dto.ForgotPasswordRequest;
import com.hotel.booking.dto.ForgotPasswordResponse;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.LoginResponse;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.dto.ResetPasswordRequest;
import com.hotel.booking.dto.UserDTO;
import com.hotel.booking.exception.ConflictException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.exception.UnauthorizedException;
import com.hotel.booking.mapper.UserMapper;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }

    public UserDTO register(RegisterRequest request) {
        String email = normalizeOptionalEmail(request.getEmail());

        if (email != null && userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ConflictException("Phonenumber is claimed");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setUserName(request.getUserName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());

        user.setRole(Role.CUSTOMER);
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);

        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.save(user);
        return UserMapper.toDto(savedUser);
    }
    
    public LoginResponse login(LoginRequest request) {
		User user = userRepository.findByPhoneNumberOrEmail(request.getPhoneNumberOrEmail(), request.getPhoneNumberOrEmail()).orElseThrow(this::invalidCredentialsException);
        
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new UnauthorizedException("Account is locked. Please try again later");
        }

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is disabled. Please try again later");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user);
            throw invalidCredentialsException();
        }

        resetLoginState(user);
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        return buildLoginResponse(savedUser);
    }

    public void changePassword(String authorizationHeader, ChangePasswordRequest request) {
        Integer userId = extractUserIdFromAuthHeader(authorizationHeader);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ConflictException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        String phoneNumber = normalizeOptionalPhoneNumber(request.getPhoneNumber());
        otpService.generateOtpForPhone(phoneNumber);
        return new ForgotPasswordResponse("If the phone number exists, a reset OTP has been sent.");
    }

    public void resetPassword(ResetPasswordRequest request) {
        String phoneNumber = normalizeOptionalPhoneNumber(request.getPhoneNumber());
        String resetOtp = normalizeOptionalPhoneNumber(request.getResetOtp());

        User user;
        boolean validOtp = otpService.verifyOtpAndConsume(phoneNumber, "RESET_PASSWORD", resetOtp);
        if (!validOtp) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        user = userRepository.findByPhoneNumber(phoneNumber)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ConflictException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public UserDTO me(String authorizationHeader) {
		Integer userId = extractUserIdFromAuthHeader(authorizationHeader);
		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.toDto(user);
    }

    public UserDTO updateProfile(String authorizationHeader, ProfileUpdateRequest request) {
        String userName = extractUserNameFromAuthHeader(authorizationHeader);
        User user = userRepository.findByUserName(userName)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userName));

        if (request.getFullName() != null) {
            user.setFullName(requiredText(request.getFullName(), "Full name is required"));
        }

        if (request.getEmail() != null) {
            String email = requiredText(request.getEmail(), "Email is required");
            ensureEmailAvailable(email, user.getId());
            user.setEmail(email);
        }

        if (request.getPhoneNumber() != null) {
            String phoneNumber = requiredText(request.getPhoneNumber(), "Phone number is required");
            ensurePhoneNumberAvailable(phoneNumber, user.getId());
            user.setPhoneNumber(phoneNumber);
        }

        user.setDateOfBirth(request.getDateOfBirth());
        user.setGenderId(resolveGenderId(request.getGender()));
        user.setCurrentAddress(blankToNull(request.getCurrentAddress()));
        user.setUpdatedAt(LocalDateTime.now());

        return UserMapper.toDto(userRepository.save(user));
    }

    private String extractUserNameFromAuthHeader(String authorizationHeader) {
        String token = jwtService.extractBearerToken(authorizationHeader);
        return jwtService.extractSubject(token);
    }

    private void ensureEmailAvailable(String email, Integer currentUserId) {
        userRepository.findByEmail(email)
            .filter(existing -> !existing.getId().equals(currentUserId))
            .ifPresent(existing -> {
                throw new ConflictException("Email already exists");
            });
    }

    private void ensurePhoneNumberAvailable(String phoneNumber, Integer currentUserId) {
        userRepository.findByPhoneNumber(phoneNumber)
            .filter(existing -> !existing.getId().equals(currentUserId))
            .ifPresent(existing -> {
                throw new ConflictException("Phonenumber is claimed");
            });
    }

    private String requiredText(String value, String message) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private Integer resolveGenderId(String gender) {
        if (gender == null || gender.isBlank()) {
            return null;
        }

        String normalized = gender.trim().toLowerCase();
        if ("nam".equals(normalized) || "male".equals(normalized)) {
            return 1;
        }
        if ("nữ".equals(normalized) || "nu".equals(normalized) || "female".equals(normalized)) {
            return 2;
        }
        return 3;
    }

    private void handleFailedLogin(User user) {
        int failedAttempts = user.getFailedLoginAttempts() == null ? 0 : user.getFailedLoginAttempts();
        failedAttempts++;
        user.setFailedLoginAttempts(failedAttempts);

        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    private void resetLoginState(User user) {
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
    }

    private LoginResponse buildLoginResponse(User user) {
        LoginResponse response = new LoginResponse();
        response.setAccessToken(jwtService.generateAccessToken(user)); 
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtService.getAccessTokenExpiresInSeconds()); 
        response.setUser(UserMapper.toDto(user));
        return response;
    }

    private UnauthorizedException invalidCredentialsException() {
        return new UnauthorizedException("Phone number or email or password not match");
    }

    private String normalizeOptionalEmail(String email) {
        if (email == null) {
            return null;
        }

        String normalizedEmail = email.trim();
        return normalizedEmail.isEmpty() ? null : normalizedEmail;
    }

    private String normalizeOptionalPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }

        String normalizedPhoneNumber = phoneNumber.trim();
        return normalizedPhoneNumber.isEmpty() ? null : normalizedPhoneNumber;
    }

    private Integer extractUserIdFromAuthHeader(String authorizationHeader) {
        String token = jwtService.extractBearerToken(authorizationHeader);
        try {
            return Integer.valueOf(jwtService.extractSubject(token));
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid access token subject");
        }
    }
}