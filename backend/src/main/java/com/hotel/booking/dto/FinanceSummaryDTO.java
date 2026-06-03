package com.hotel.booking.dto;

import java.util.List;

public class FinanceSummaryDTO {
    private Long totalEarnings;
    private Long pendingPayouts;
    private Long taxSummary;
    private String currency;

    public FinanceSummaryDTO() {}

    public FinanceSummaryDTO(Long totalEarnings, Long pendingPayouts, Long taxSummary, String currency) {
        this.totalEarnings = totalEarnings;
        this.pendingPayouts = pendingPayouts;
        this.taxSummary = taxSummary;
        this.currency = currency;
    }

    public Long getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(Long totalEarnings) { this.totalEarnings = totalEarnings; }

    public Long getPendingPayouts() { return pendingPayouts; }
    public void setPendingPayouts(Long pendingPayouts) { this.pendingPayouts = pendingPayouts; }

    public Long getTaxSummary() { return taxSummary; }
    public void setTaxSummary(Long taxSummary) { this.taxSummary = taxSummary; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
