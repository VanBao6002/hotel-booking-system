package com.hotel.booking.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Phone number or email cannot be blank")
    private String phoneNumberOrEmail;
    
    @NotBlank(message = "Password cannot be blank")
    private String password;

    public String getPhoneNumberOrEmail() {
        return phoneNumberOrEmail;
    }

    public void setPhoneNumberOrEmail(String phoneNumberOrEmail) {
        this.phoneNumberOrEmail = phoneNumberOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
