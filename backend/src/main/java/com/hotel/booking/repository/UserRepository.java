package com.hotel.booking.repository;

import com.hotel.booking.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);
}