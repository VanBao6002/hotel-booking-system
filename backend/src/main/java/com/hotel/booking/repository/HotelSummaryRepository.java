package com.hotel.booking.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class HotelSummaryRepository {

    private final JdbcTemplate jdbcTemplate;

    public HotelSummaryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy dữ liệu aggregate từ bảng hotelreview
    public Map<String, Object> getSummaryData(int branchId) {
        String sql = "SELECT " +
                     "SUM(CASE WHEN rating=1 THEN 1 ELSE 0 END) AS one_star, " +
                     "SUM(CASE WHEN rating=2 THEN 1 ELSE 0 END) AS two_star, " +
                     "SUM(CASE WHEN rating=3 THEN 1 ELSE 0 END) AS three_star, " +
                     "SUM(CASE WHEN rating=4 THEN 1 ELSE 0 END) AS four_star, " +
                     "SUM(CASE WHEN rating=5 THEN 1 ELSE 0 END) AS five_star, " +
                     "AVG(rating) AS average_star " +
                     "FROM hotelreview WHERE hotel_branch_id = ?";
        return jdbcTemplate.queryForMap(sql, branchId);
    }

    // Cập nhật bảng hotelratingsummary
    public void saveSummary(int branchId, Map<String, Object> summary) {
        jdbcTemplate.update("REPLACE INTO hotelratingsummary " +
                            "(hotel_branch_id, one_star, two_star, three_star, four_star, five_star, average_star) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?)",
                branchId,
                summary.get("one_star"),
                summary.get("two_star"),
                summary.get("three_star"),
                summary.get("four_star"),
                summary.get("five_star"),
                summary.get("average_star"));
    }
}
