package com.hotel.booking.config;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class RequestAccessPolicyTest {

    @Test
    void shouldMatchOpenApiRootPathAsPublicEndpoint() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v3/api-docs");

        assertTrue(RequestAccessPolicy.isPublicEndpoint(request));
    }

    @Test
    void shouldMatchOpenApiChildPathAsPublicEndpoint() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v3/api-docs/swagger-config");

        assertTrue(RequestAccessPolicy.isPublicEndpoint(request));
    }

    @Test
    void shouldMatchSwaggerUiHtmlAsPublicEndpoint() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/swagger-ui.html");

        assertTrue(RequestAccessPolicy.isPublicEndpoint(request));
    }

    @Test
    void shouldMatchAuthLoginAsPublicEndpoint() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/auth/login");

        assertTrue(RequestAccessPolicy.isPublicEndpoint(request));
    }

    @Test
    void shouldNotMatchProtectedPathAsPublicEndpoint() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/users/me");

        assertFalse(RequestAccessPolicy.isPublicEndpoint(request));
    }

    @Test
    void shouldTreatOptionsAsSkipAuthentication() {
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/v1/users");

        assertTrue(RequestAccessPolicy.shouldSkipAuthentication(request));
    }
}
