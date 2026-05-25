package com.hotel.booking.dto;

public class HotelRatingSummaryDTO {
    private int hotelBranchId;
    private int oneStar;
    private int twoStar;
    private int threeStar;
    private int fourStar;
    private int fiveStar;
    private double averageStar;

    // Constructor mặc định
    public HotelRatingSummaryDTO() {}

    // Constructor đầy đủ
    public HotelRatingSummaryDTO(int hotelBranchId, int oneStar, int twoStar,
                                 int threeStar, int fourStar, int fiveStar, double averageStar) {
        this.hotelBranchId = hotelBranchId;
        this.oneStar = oneStar;
        this.twoStar = twoStar;
        this.threeStar = threeStar;
        this.fourStar = fourStar;
        this.fiveStar = fiveStar;
        this.averageStar = averageStar;
    }

    // Getter & Setter
    public int getHotelBranchId() { return hotelBranchId; }
    public void setHotelBranchId(int hotelBranchId) { this.hotelBranchId = hotelBranchId; }

    public int getOneStar() { return oneStar; }
    public void setOneStar(int oneStar) { this.oneStar = oneStar; }

    public int getTwoStar() { return twoStar; }
    public void setTwoStar(int twoStar) { this.twoStar = twoStar; }

    public int getThreeStar() { return threeStar; }
    public void setThreeStar(int threeStar) { this.threeStar = threeStar; }

    public int getFourStar() { return fourStar; }
    public void setFourStar(int fourStar) { this.fourStar = fourStar; }

    public int getFiveStar() { return fiveStar; }
    public void setFiveStar(int fiveStar) { this.fiveStar = fiveStar; }

    public double getAverageStar() { return averageStar; }
    public void setAverageStar(double averageStar) { this.averageStar = averageStar; }
}
