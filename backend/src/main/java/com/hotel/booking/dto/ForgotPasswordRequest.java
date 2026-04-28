package com.hotel.booking.dto;

import jakarta.validation.constraints.Pattern;

public class ForgotPasswordRequest {

    @Pattern(
        regexp = "^(|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})$",
        message = "Email should be valid"
    )
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
