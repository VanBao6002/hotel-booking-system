package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDTO {
    private Integer id;
    private String email;
    private String fullName;
    private String userName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String currentAddress;
    private LocalDateTime lockedUntil;
    private String role;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPhoneNumber() {return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber; }

    public LocalDate getDateOfBirth() {return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCurrentAddress() {return currentAddress; }
    public void setCurrentAddress(String currentAddress) { this.currentAddress = currentAddress; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}