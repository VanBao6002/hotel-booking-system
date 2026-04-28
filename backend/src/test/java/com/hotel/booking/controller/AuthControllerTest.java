package com.hotel.booking.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

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
import org.springframework.test.context.ActiveProfiles;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.booking.dto.ForgotPasswordRequest;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.model.Role;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
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

    private RegisterRequest validAdminRegisterRequest;

    private LoginRequest validAdminLoginRequest;

    private ForgotPasswordRequest validForgotPasswordRequest;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        // normal user
        validRegisterRequest = new RegisterRequest();
        validRegisterRequest.setPassword("TestPassword123");
        validRegisterRequest.setFullName("Tester");
        validRegisterRequest.setEmail("Test@gmail.com");
        validRegisterRequest.setPhoneNumber("12345678");

        User normalUser = new User();
        normalUser.setEmail(validRegisterRequest.getEmail());
        normalUser.setPasswordHash(passwordEncoder.encode(validRegisterRequest.getPassword()));
        normalUser.setFullName(validRegisterRequest.getFullName());
        normalUser.setPhoneNumber(validRegisterRequest.getPhoneNumber());

        normalUser.setRole(Role.USER);
        normalUser.setIsActive(true);
        normalUser.setFailedLoginAttempts(0);

        LocalDateTime now = LocalDateTime.now();
        normalUser.setCreatedAt(now);
        normalUser.setUpdatedAt(now);

        userRepository.save(normalUser);

        validLoginRequest = new LoginRequest();
        validLoginRequest.setPhoneNumberOrEmail(validRegisterRequest.getPhoneNumber());
        validLoginRequest.setPassword("TestPassword123");

        invalidLoginRequest = new LoginRequest();
        invalidLoginRequest.setPhoneNumberOrEmail(validRegisterRequest.getPhoneNumber());
        invalidLoginRequest.setPassword("12345678");
        
        // admin user
        validAdminRegisterRequest = new RegisterRequest();
        validAdminRegisterRequest.setPassword("TestPassword123");
        validAdminRegisterRequest.setFullName("Test_Admin");
        validAdminRegisterRequest.setEmail("Test_Admin@gmail.com");
        validAdminRegisterRequest.setPhoneNumber("1231231231");

        User adminUser = new User();
        adminUser.setEmail(validAdminRegisterRequest.getEmail());
        adminUser.setPasswordHash(passwordEncoder.encode(validAdminRegisterRequest.getPassword()));
        adminUser.setFullName(validAdminRegisterRequest.getFullName());
        adminUser.setPhoneNumber(validAdminRegisterRequest.getPhoneNumber());

        adminUser.setRole(Role.ADMIN);
        adminUser.setIsActive(true);
        adminUser.setFailedLoginAttempts(0);

        adminUser.setCreatedAt(now);
        adminUser.setUpdatedAt(now);

        userRepository.save(adminUser);

        validAdminLoginRequest = new LoginRequest();
        validAdminLoginRequest.setPhoneNumberOrEmail(validAdminRegisterRequest.getPhoneNumber());
        validAdminLoginRequest.setPassword("TestPassword123");

        validForgotPasswordRequest = new ForgotPasswordRequest();
        validForgotPasswordRequest.setEmail("Test_Admin@gmail.com");
        
    }

    @Test
    void testLoginWithValidCredentials() throws Exception {
        String requestBody = objectMapper.writeValueAsString(validLoginRequest);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").exists())
        .andExpect(jsonPath("$.tokenType").value("Bearer"))
        .andExpect(jsonPath("$.expiresIn").exists())
        .andExpect(jsonPath("$.user.role").value("USER"));
    }

    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        String requestBody = objectMapper.writeValueAsString(invalidLoginRequest);
        
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.error").value("Unauthorized"))
        .andExpect(jsonPath("$.message").value("Phone number or email or password not match"))
        .andExpect(jsonPath("$.path").value("/api/v1/auth/login"));
    }

    @Test
    void testNormalUserCannotAccessUsersList() throws Exception {
        // Login as normal user
        String loginBody = objectMapper.writeValueAsString(validLoginRequest);
        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Extract token from response
        String token = objectMapper.readTree(loginResponse).get("accessToken").asText();
        
        // Normal user should be forbidden from accessing /api/v1/users
        mockMvc.perform(get("/api/v1/users")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isForbidden());
    }
    
    @Test
    void testAdminCanAccessUsersList() throws Exception {
        // Login as admin user
        String loginBody = objectMapper.writeValueAsString(validAdminLoginRequest);
        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Extract token from response
        String token = objectMapper.readTree(loginResponse).get("accessToken").asText();
        
        // Admin user should be able to access /api/v1/users
        mockMvc.perform(get("/api/v1/users")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());
    }

    @Test
    void testAuthMeWithoutAuthorizationHeader() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void testAuthMeWithMalformedBearerToken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
            .header("Authorization", "NoBearer"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void testAuthMeWithGarbageToken() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me")
            .header("Authorization", "Bearer IamAGarbageToken"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401));
    }

    @Test 
    void testValidAuthMe() throws Exception {
        // Login as admin user
        String loginBody = objectMapper.writeValueAsString(validAdminLoginRequest);
        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginBody))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Extract token from response
        String token = objectMapper.readTree(loginResponse).get("accessToken").asText();
        
        mockMvc.perform(get("/api/v1/auth/me")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void testForgotPasswordWithValidEmail() throws Exception {
        String body = objectMapper.writeValueAsString(validForgotPasswordRequest);
        mockMvc.perform(post("/api/v1/auth/forgot-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("If the email exists, a reset link has been sent."));       
    }

    @Test
    void testForgotPasswordWithUnknownEmail() throws Exception {
        ForgotPasswordRequest unknownEmailRequest = new ForgotPasswordRequest();
        unknownEmailRequest.setEmail("unknown@example.com");

        String body = objectMapper.writeValueAsString(unknownEmailRequest);
        mockMvc.perform(post("/api/v1/auth/forgot-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message").value("If the email exists, a reset link has been sent."));
    }

    @Test
    void testPreflightOptionsToProtectedEndpointIsAllowed() throws Exception {
        mockMvc.perform(options("/api/v1/users")
                .header("Origin", "http://localhost:3000")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Authorization"))
            .andExpect(status().is2xxSuccessful())
            .andExpect(header().exists("Access-Control-Allow-Origin"));
    }
}
