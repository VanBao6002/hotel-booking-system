package com.hotel.booking.service;

import com.hotel.booking.model.PasswordOtp;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.PasswordOtpRepository;
import com.hotel.booking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_TTL_SECONDS = 300; // 5 minutes
    private static final int MAX_VERIFICATION_ATTEMPTS = 3;

    private final PasswordOtpRepository otpRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(PasswordOtpRepository otpRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      SmsService smsService) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.smsService = smsService;
    }

    public void generateOtpForPhone(String phoneNumber) {
        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        if (userOpt.isEmpty()) {
            return; // behave generically to avoid account enumeration
        }

        String otp = generateNumericOtp();
        String otpHash = passwordEncoder.encode(otp);

        Instant now = Instant.now();
        PasswordOtp record = new PasswordOtp();
        record.setUserId(userOpt.get().getId());
        record.setPhoneNumber(phoneNumber);
        record.setOtpHash(otpHash);
        record.setPurpose("RESET_PASSWORD");
        record.setCreatedAt(now);
        record.setExpiresAt(now.plusSeconds(OTP_TTL_SECONDS));
        record.setIsUsed(false);
        record.setAttempts(0);

        otpRepository.save(record);

        String message = String.format("Your verification code is %s. It expires in 5 minutes.", otp);
        try {
            smsService.sendOtp(phoneNumber, message);
        } catch (Exception ex) {
            // In minimal implementation we swallow SMS errors; in production log/monitor and retry.
        }
    }

    @Transactional
    public boolean verifyOtpAndConsume(String phoneNumber, String purpose, String otp) {
        Optional<PasswordOtp> otpOpt = otpRepository.findFirstByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
                phoneNumber, purpose, Instant.now());

        if (otpOpt.isEmpty()) {
            return false;
        }

        PasswordOtp record = otpOpt.get();

        if (passwordEncoder.matches(otp, record.getOtpHash())) {
            record.setIsUsed(true);
            otpRepository.save(record);
            return true;
        }

        int attempts = record.getAttempts() == null ? 0 : record.getAttempts();
        attempts++;
        record.setAttempts(attempts);
        if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
            record.setIsUsed(true);
        }
        otpRepository.save(record);
        return false;
    }

    private String generateNumericOtp() {
        int min = (int) Math.pow(10, OTP_LENGTH - 1);
        int max = (int) Math.pow(10, OTP_LENGTH) - 1;
        int value = secureRandom.nextInt(max - min + 1) + min;
        return Integer.toString(value);
    }

}
