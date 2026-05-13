package com.hotel.booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class LoggingSmsService implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(LoggingSmsService.class);
    private final DebugSmsService debugSmsService;

    public LoggingSmsService(DebugSmsService debugSmsService) {
        this.debugSmsService = debugSmsService;
    }

    @Override
    public void sendOtp(String phoneNumber, String message) {
        debugSmsService.record(phoneNumber, message);
        // Minimal local implementation. Replace with real provider (Twilio/SNS) in production.
        log.info("[SMS-MOCK] to={} message={}", phoneNumber, message);
    }
}
