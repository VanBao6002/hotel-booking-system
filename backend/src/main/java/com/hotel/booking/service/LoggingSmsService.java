package com.hotel.booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoggingSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(LoggingSmsService.class);

    @Override
    public void sendOtp(String phoneNumber, String message) {
        // Minimal local implementation. Replace with real provider (Twilio/SNS) in production.
        log.info("[SMS-MOCK] to={} message={}", phoneNumber, message);
    }
}
