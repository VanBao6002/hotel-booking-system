package com.hotel.booking.dto;

import jakarta.validation.constraints.Pattern;

public class ForgotPasswordRequest {

    @Pattern(
        regexp = "^.+@.+\\..+$",
        message = "email should be valid"
    )
    private String email;

    @Pattern(
        regexp = "^\\+?[0-9]{9,15}$",
        message = "phoneNumber should be valid"
    )
    private String phoneNumber;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
