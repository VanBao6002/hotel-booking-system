package com.hotel.booking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDTO {
    private Integer id;
    private String userName;
    private String email;
    private String fullName;
    private String phoneNumber;
    private LocalDate dateOfBbirth;
    private String gender;
    private String currentAddress;
    private LocalDateTime lockedUntil;
    private String lockReason;
    private Boolean active;
    private String role;
    private Integer staffHotelBranchId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() {return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) {this.phoneNumber = phoneNumber; }

    public LocalDate getDateOfBirth() {return dateOfBbirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBbirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCurrentAddress() {return currentAddress; }
    public void setCurrentAddress(String currentAddress) { this.currentAddress = currentAddress; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public String getLockReason() { return lockReason; }
    public void setLockReason(String lockReason) { this.lockReason = lockReason; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getStaffHotelBranchId() { return staffHotelBranchId; }
    public void setStaffHotelBranchId(Integer staffHotelBranchId) { this.staffHotelBranchId = staffHotelBranchId; }
}
