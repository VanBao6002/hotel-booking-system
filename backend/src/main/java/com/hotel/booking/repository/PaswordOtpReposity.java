package com.hotel.booking.repository;

import com.hotel.booking.model.PasswordOtp;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaswordOtpReposity extends JpaRepository<PasswordOtp, Integer> {

    Optional<PasswordOtp> findByPhoneNumber(String phoneNumber);

}   