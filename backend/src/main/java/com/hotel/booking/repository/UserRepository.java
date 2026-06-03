package com.hotel.booking.repository;

import com.hotel.booking.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByUserName(String userName);

    Optional<User> findByUserNameOrEmail(String userName, String email);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    boolean existsByPhoneNumber(String phoneNumber);
}   
