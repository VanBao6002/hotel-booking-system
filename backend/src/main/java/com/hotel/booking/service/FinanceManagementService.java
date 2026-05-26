package com.hotel.booking.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.hotel.booking.dto.FinanceSummaryDTO;
import com.hotel.booking.dto.MonthlyRevenueDTO;
import com.hotel.booking.dto.TransactionDTO;
import com.hotel.booking.repository.DatabaseSchemaInspector;

@Service
public class FinanceManagementService {
    private final JdbcTemplate jdbcTemplate;
    private final DatabaseSchemaInspector schemaInspector;

    public FinanceManagementService(JdbcTemplate jdbcTemplate, DatabaseSchemaInspector schemaInspector) {
        this.jdbcTemplate = jdbcTemplate;
        this.schemaInspector = schemaInspector;
    }

    public FinanceSummaryDTO getFinanceSummary() {
        Long totalEarnings = queryLong("SELECT COALESCE(SUM(amount), 0) FROM receipt");
        Long expectedRevenue = queryExpectedRevenue();
        long pendingPayouts = Math.max(0L, expectedRevenue - totalEarnings);
        long taxSummary = Math.round(totalEarnings * 0.1);

        return new FinanceSummaryDTO(totalEarnings, pendingPayouts, taxSummary, "VND");
    }

    public List<TransactionDTO> getTransactions(Integer page, Integer pageSize, LocalDate startDate, LocalDate endDate) {
        StringBuilder sql = new StringBuilder("""
            SELECT rc.id,
                   rc.paymentDate,
                   CONCAT('Booking ', b.id, ' - ', COALESCE(hb.address, 'Unknown hotel')) AS description,
                   rc.amount
            FROM receipt rc
            LEFT JOIN booking b ON rc.BookingID = b.id
            LEFT JOIN hotelbranch hb ON b.hotel_branch_id = hb.id
            WHERE (? IS NULL OR rc.paymentDate >= ?)
              AND (? IS NULL OR rc.paymentDate <= ?)
            ORDER BY rc.paymentDate DESC, rc.id DESC
            """);

        List<Object> params = new ArrayList<>();
        params.add(startDate);
        params.add(startDate);
        params.add(endDate);
        params.add(endDate);

        if (pageSize != null && pageSize > 0) {
            int safePage = page == null || page < 1 ? 1 : page;
            sql.append(" LIMIT ? OFFSET ?");
            params.add(pageSize);
            params.add((safePage - 1) * pageSize);
        }

        return jdbcTemplate.query(
            sql.toString(),
            (rs, rowNum) -> new TransactionDTO(
                rs.getInt("id"),
                rs.getDate("paymentDate").toLocalDate(),
                rs.getString("description"),
                rs.getLong("amount"),
                "Completed",
                "revenue"
            ),
            params.toArray()
        );
    }

    public MonthlyRevenueDTO getMonthlyRevenue(Integer year) {
        int selectedYear = year != null ? year : Year.now().getValue();
        List<MonthlyRevenueDTO.MonthDataDTO> monthlyData = new ArrayList<>();
        for (Month month : Month.values()) {
            monthlyData.add(new MonthlyRevenueDTO.MonthDataDTO(month.name().substring(0, 3), 0L, 0L));
        }

        String sql = """
            SELECT MONTH(paymentDate) AS month_number,
                   COALESCE(SUM(amount), 0) AS revenue
            FROM receipt
            WHERE YEAR(paymentDate) = ?
            GROUP BY MONTH(paymentDate)
            """;

        jdbcTemplate.query(sql, rs -> {
            int monthIndex = rs.getInt("month_number") - 1;
            if (monthIndex >= 0 && monthIndex < monthlyData.size()) {
                monthlyData.get(monthIndex).setRevenue(rs.getLong("revenue"));
            }
        }, selectedYear);

        return new MonthlyRevenueDTO(selectedYear, monthlyData);
    }

    private Long queryLong(String sql) {
        Long value = jdbcTemplate.queryForObject(sql, Long.class);
        return value == null ? 0L : value;
    }

    private Long queryExpectedRevenue() {
        if (schemaInspector.columnExists("booking", "booking_price")) {
            return queryLong("SELECT COALESCE(SUM(booking_price), 0) FROM booking");
        }

        if (schemaInspector.tableExists("booking_room")) {
            return queryRevenueRows("""
                SELECT b.id,
                       b.check_in_date,
                       b.check_out_date,
                       SUM(COALESCE(r.price, 0)) AS nightly_price
                FROM booking b
                JOIN booking_room br ON br.booking_id = b.id
                LEFT JOIN room r ON br.room_id = r.id
                GROUP BY b.id, b.check_in_date, b.check_out_date
                """);
        }

        if (schemaInspector.columnExists("booking", "room_id")) {
            return queryRevenueRows("""
                SELECT b.id,
                       b.check_in_date,
                       b.check_out_date,
                       COALESCE(r.price, 0) AS nightly_price
                FROM booking b
                LEFT JOIN room r ON b.room_id = r.id
                """);
        }

        return 0L;
    }

    private Long queryRevenueRows(String sql) {
        return jdbcTemplate.query(sql, rs -> {
            long total = 0L;
            while (rs.next()) {
                LocalDate checkIn = rs.getDate("check_in_date").toLocalDate();
                LocalDate checkOut = rs.getDate("check_out_date").toLocalDate();
                long nights = Math.max(1L, ChronoUnit.DAYS.between(checkIn, checkOut));
                total += nights * rs.getLong("nightly_price");
            }
            return total;
        });
    }
}
