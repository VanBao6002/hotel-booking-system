package com.hotel.booking.repository;

import com.hotel.booking.dto.HotelReviewDTO;
import com.hotel.booking.dto.HotelReviewResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HotelReviewRepository {

    private final JdbcTemplate jdbcTemplate;

    public HotelReviewRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Lấy tất cả review theo hotel_branch_id
    public List<HotelReviewDTO> getReviewsByHotelBranchId(int hotelBranchId) {
        String sql = "SELECT r.id, r.hotel_branch_id, r.user_id, u.user_name, " +
                    "r.rating, r.comment, r.created_at " +
                    "FROM hotelreview r " +
                    "JOIN users u ON r.user_id = u.id " +
                    "WHERE r.hotel_branch_id = ? " +
                    "ORDER BY r.created_at DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new HotelReviewDTO(
                rs.getInt("id"),
                rs.getInt("hotel_branch_id"),
                rs.getInt("user_id"),
                rs.getString("user_name"),   // map thêm tên user
                rs.getInt("rating"),
                rs.getString("comment"),
                rs.getDate("created_at").toLocalDate()
        ), hotelBranchId);
    }



    // Lấy summary (tỉ lệ phần trăm sao + average) + list review
   public HotelReviewResponse getHotelReviewSummary(int hotelBranchId) {
    String sqlSummary = "SELECT * FROM hotelratingsummary WHERE hotel_branch_id = ?";
    HotelReviewResponse response = jdbcTemplate.queryForObject(sqlSummary, (rs, rowNum) -> {
        HotelReviewResponse r = new HotelReviewResponse();
        int one = rs.getInt("one_star");
        int two = rs.getInt("two_star");
        int three = rs.getInt("three_star");
        int four = rs.getInt("four_star");
        int five = rs.getInt("five_star");
        int total = one + two + three + four + five;

        r.setAverageStar(rs.getDouble("average_star"));
        r.setOneStarPercent(total == 0 ? 0 : Math.round(one * 10000.0 / total) / 100.0);
        r.setTwoStarPercent(total == 0 ? 0 : Math.round(two * 10000.0 / total) / 100.0);
        r.setThreeStarPercent(total == 0 ? 0 : Math.round(three * 10000.0 / total) / 100.0);
        r.setFourStarPercent(total == 0 ? 0 : Math.round(four * 10000.0 / total) / 100.0);
        r.setFiveStarPercent(total == 0 ? 0 : Math.round(five * 10000.0 / total) / 100.0);
        return r;
    }, hotelBranchId);
    // Lấy list review
    List<HotelReviewDTO> reviews = getReviewsByHotelBranchId(hotelBranchId);
    response.setReviews(reviews);

    return response;
}

    public int addReview(HotelReviewDTO review) {
        String sql = "INSERT INTO hotelreview (hotel_branch_id, user_id, rating, comment, created_at) " +
                     "VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                review.getHotelBranchId(),
                review.getUserId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
