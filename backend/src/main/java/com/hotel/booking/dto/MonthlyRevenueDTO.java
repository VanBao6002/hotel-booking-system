package com.hotel.booking.dto;

import java.util.List;

public class MonthlyRevenueDTO {
    private Integer year;
    private List<MonthDataDTO> data;

    public MonthlyRevenueDTO() {}

    public MonthlyRevenueDTO(Integer year, List<MonthDataDTO> data) {
        this.year = year;
        this.data = data;
    }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public List<MonthDataDTO> getData() { return data; }
    public void setData(List<MonthDataDTO> data) { this.data = data; }

    /**
     * Inner class for monthly data
     */
    public static class MonthDataDTO {
        private String month;
        private Long revenue;
        private Long expenses;

        public MonthDataDTO() {}

        public MonthDataDTO(String month, Long revenue, Long expenses) {
            this.month = month;
            this.revenue = revenue;
            this.expenses = expenses;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }

        public Long getRevenue() { return revenue; }
        public void setRevenue(Long revenue) { this.revenue = revenue; }

        public Long getExpenses() { return expenses; }
        public void setExpenses(Long expenses) { this.expenses = expenses; }
    }
}
