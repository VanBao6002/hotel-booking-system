package com.hotel.booking.dto;

import java.util.List; 
public class HotelReviewResponse {
    private double averageStar;
    private double oneStarPercent;
    private double twoStarPercent;
    private double threeStarPercent;
    private double fourStarPercent;
    private double fiveStarPercent;
    private List<HotelReviewDTO> reviews;

    // Getter & Setter
    public double getAverageStar() { return averageStar; }
    public void setAverageStar(double averageStar) { this.averageStar = averageStar; }

    public double getOneStarPercent() { return oneStarPercent; }
    public void setOneStarPercent(double oneStarPercent) { this.oneStarPercent = oneStarPercent; }

    public double getTwoStarPercent() { return twoStarPercent; }
    public void setTwoStarPercent(double twoStarPercent) { this.twoStarPercent = twoStarPercent; }

    public double getThreeStarPercent() { return threeStarPercent; }
    public void setThreeStarPercent(double threeStarPercent) { this.threeStarPercent = threeStarPercent; }

    public double getFourStarPercent() { return fourStarPercent; }
    public void setFourStarPercent(double fourStarPercent) { this.fourStarPercent = fourStarPercent; }

    public double getFiveStarPercent() { return fiveStarPercent; }
    public void setFiveStarPercent(double fiveStarPercent) { this.fiveStarPercent = fiveStarPercent; }

    public List<HotelReviewDTO> getReviews() { return reviews; }
    public void setReviews(List<HotelReviewDTO> reviews) { this.reviews = reviews; }
}
