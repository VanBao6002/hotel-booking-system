package com.hotel.booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class DebugSmsService {

    private static final Logger log = LoggerFactory.getLogger(DebugSmsService.class);
    private final ConcurrentMap<String, String> lastMessages = new ConcurrentHashMap<>();

    public void record(String phoneNumber, String message) {
        lastMessages.put(phoneNumber, message);
    }

    public Optional<String> getLastMessage(String phoneNumber) {
        return Optional.ofNullable(lastMessages.get(phoneNumber));
    }
}