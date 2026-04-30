package com.hotel.booking.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.AntPathMatcher;

public final class RequestAccessPolicy {

    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    public static final String[] PUBLIC_ENDPOINTS = {
        "/v3/api-docs",
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html",
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/search/hotel"
    };

    private RequestAccessPolicy() {
    }

    public static boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        for (String endpointPattern : PUBLIC_ENDPOINTS) {
            if (PATH_MATCHER.match(endpointPattern, path)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isOptionsMethod(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    public static boolean shouldSkipAuthentication(HttpServletRequest request) {
        return isOptionsMethod(request) || isPublicEndpoint(request);
    }

}
