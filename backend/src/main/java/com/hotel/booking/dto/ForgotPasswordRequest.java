package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ForgotPasswordRequest {
    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(
        regexp = "^\\+?[0-9]{9,15}$",
        message = "phoneNumber should be valid"
    )
    private String phoneNumber;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
