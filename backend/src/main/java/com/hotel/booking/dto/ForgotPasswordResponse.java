package com.hotel.booking.dto;

public class ForgotPasswordResponse {
    private String resetToken;
    private long expiresIn;

    public ForgotPasswordResponse() {
    }

    public ForgotPasswordResponse(String resetToken, long expiresIn) {
        this.resetToken = resetToken;
        this.expiresIn = expiresIn;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
