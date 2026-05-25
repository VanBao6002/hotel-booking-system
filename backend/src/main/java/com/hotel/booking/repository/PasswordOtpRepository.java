package com.hotel.booking.repository;

import com.hotel.booking.model.PasswordOtp;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordOtpRepository extends JpaRepository<PasswordOtp, Integer> {

    Optional<PasswordOtp> findFirstByPhoneNumberAndPurposeAndIsUsedFalseAndExpiresAtAfterOrderByCreatedAtDesc(
            String phoneNumber, String purpose, Instant now);

}
