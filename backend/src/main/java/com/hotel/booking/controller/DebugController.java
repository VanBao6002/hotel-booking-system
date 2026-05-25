package com.hotel.booking.controller;

import com.hotel.booking.service.DebugSmsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/internal/debug")
public class DebugController {

    private final DebugSmsService smsService;
    private final Pattern otpPattern = Pattern.compile("(\\d{6})");

    public DebugController(DebugSmsService smsService) {
        this.smsService = smsService;
    }

    @GetMapping("/last-otp")
    public ResponseEntity<String> lastOtp(@RequestParam("phone") String phone) {
        Optional<String> msg = smsService.getLastMessage(phone);
        if (msg.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Matcher m = otpPattern.matcher(msg.get());
        if (m.find()) {
            return ResponseEntity.ok(m.group(1));
        }
        return ResponseEntity.ok(msg.get());
    }
}