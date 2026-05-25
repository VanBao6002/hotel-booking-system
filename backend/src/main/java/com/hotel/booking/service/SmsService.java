package com.hotel.booking.service;

public interface SmsService {
    /**
     * Send an OTP message to the given phone number. Implementations should send
     * messages asynchronously and avoid throwing unchecked exceptions for transient failures.
     */
    void sendOtp(String phoneNumber, String message);
}
