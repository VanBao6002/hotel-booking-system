package com.hotel.booking.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.booking.exception.ApiErrorResponse;
import com.hotel.booking.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    private final ObjectMapper objectMapper;

    public SecurityConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception { 
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(RequestAccessPolicy.PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/media/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/rooms/*/media").hasRole("ADMIN")
                        .requestMatchers("/api/v1/users/profile").authenticated()
                        .requestMatchers("/api/v1/users/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers("/api/v1/staff/**").hasAnyRole("STAFF", "MANAGER")
                        .requestMatchers("/api/v1/hotels/**", "/api/v1/bookings/**", "/api/v1/finance/**", "/api/v1/dashboard/**").hasRole("MANAGER")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated())
                    .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) ->
                            writeAuthError(
                                response,
                                request.getRequestURI(),
                                HttpStatus.UNAUTHORIZED,
                                "Unauthorized",
                                "Authentication required"))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                            writeAuthError(
                                response,
                                request.getRequestURI(),
                                HttpStatus.FORBIDDEN,
                                "Forbidden",
                                "Access denied")))
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList());
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { 
        return new BCryptPasswordEncoder();
    }

    private void writeAuthError( 
            jakarta.servlet.http.HttpServletResponse response,
            String path,
            HttpStatus status,
            String error,
            String message) throws IOException {

        response.setStatus(status.value());
        response.setContentType("application/json");

        ApiErrorResponse body = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                error,
                message,
                path
        );

        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
