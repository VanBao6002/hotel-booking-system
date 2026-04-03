package com.hotel.booking.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;

/**
 * Integration tests for AuthController endpoints.
 * 
 * TODOs for you:
 * 1. Set up a test user in the database before each test (see @BeforeEach)
 * 2. Write a test that registers a new user, then logs in with those credentials
 * 3. Assert the response contains accessToken, tokenType, and expiresIn
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterRequest validRegisterRequest;

    private LoginRequest validLoginRequest;

    private LoginRequest invalidLoginRequest;

    @BeforeEach
    void setUp() {
        // TODO: Clear the database and create a test user here
        // Example: userRepository.deleteAll();
        // Then create a user with known credentials to use in your tests

        userRepository.deleteAll();

        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setUserName("testuser");
        validRegisterRequest.setPassword("TestPassword123");
        validRegisterRequest.setFullName("Tester");
        validRegisterRequest.setEmail("Test@gmail.com");
        validRegisterRequest.setPhoneNumber("12345678");

        User user = new User();
        user.setUserName(validRegisterRequest.getUserName());
        user.setEmail(validRegisterRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(validRegisterRequest.getPassword()));
        user.setFullName(validRegisterRequest.getFullName());
        user.setPhoneNumber(validRegisterRequest.getPhoneNumber());

        user.setRoleId(1); 
        user.setIsActive(true);
        user.setFailedLoginAttempts(0);

        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        userRepository.save(user);

        validLoginRequest = new LoginRequest();
        validLoginRequest.setUserNameOrEmail("testuser");
        validLoginRequest.setPassword("TestPassword123");

        invalidLoginRequest = new LoginRequest();
        invalidLoginRequest.setUserNameOrEmail("testuser");
        invalidLoginRequest.setPassword("12345678");
    }

    @SuppressWarnings("null")
    @Test
    void testLoginWithValidCredentials() throws Exception {
        // TODO: Before this test runs, make sure a user exists in the database
        // with userName "testuser" and password "TestPassword123"
        
        // Step 1: Send POST request to /api/v1/auth/login with valid credentials
        String requestBody = objectMapper.writeValueAsString(validLoginRequest);
        
        // Step 2: Assert response status is 200
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isOk())
        // Step 3: Assert response contains accessToken
        .andExpect(jsonPath("$.accessToken").exists())
        // Step 4: Assert response contains tokenType
        .andExpect(jsonPath("$.tokenType").value("Bearer"))
        // Step 5: (Optional) Assert expiresIn is present
        .andExpect(jsonPath("$.expiresIn").exists());
    }

    // TODO: Write a second test for invalid credentials
    // It should assert the response status is 401 (Unauthorized)

    @SuppressWarnings("null")
    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        String requestBody = objectMapper.writeValueAsString(invalidLoginRequest);
        
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isUnauthorized());
    }
}
