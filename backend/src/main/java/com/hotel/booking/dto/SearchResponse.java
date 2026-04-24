package com.hotel.booking.dto;

import java.util.List;

public class SearchResponse {
    private List<HotelBranchDTO> branches;
    private String message;

    // Constructor mặc định
    public SearchResponse() {
    }

    // Constructor đầy đủ
    public SearchResponse(List<HotelBranchDTO> branches, String message) {
        this.branches = branches;
        this.message = message;
    }

    // Getter & Setter cho message
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    // Getter & Setter cho branches
    public List<HotelBranchDTO> getBranches() {
        return branches;
    }
    public void setBranches(List<HotelBranchDTO> branches) {
        this.branches = branches;
    }
}
