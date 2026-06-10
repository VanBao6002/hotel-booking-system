package com.hotel.booking.service;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.booking.dto.NotificationDTO;
import com.hotel.booking.exception.ResourceNotFoundException;

@Service
public class NotificationService {

    private final JdbcTemplate jdbcTemplate;

    public NotificationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<NotificationDTO> getUnreadNotifications(Integer userId) {
        String sql = """
            SELECT n.id, n.message, n.createAt, ns.status
            FROM notification n
            LEFT JOIN notificationstatus ns ON ns.id = n.NotificationStatusID
            WHERE n.UserID = ?
              AND LOWER(COALESCE(ns.status, 'Unread')) = 'unread'
            ORDER BY n.createAt ASC, n.id ASC
            """;

        return jdbcTemplate.query(
            sql,
            (rs, rowNum) -> new NotificationDTO(
                rs.getInt("id"),
                rs.getString("message"),
                rs.getTimestamp("createAt").toLocalDateTime(),
                rs.getString("status")
            ),
            userId
        );
    }

    @Transactional
    public void markAsRead(Integer userId, Integer notificationId) {
        int affected = jdbcTemplate.update(
            """
            UPDATE notification n
            JOIN notificationstatus ns ON LOWER(ns.status) = 'read'
            SET n.NotificationStatusID = ns.id
            WHERE n.id = ? AND n.UserID = ?
            """,
            notificationId,
            userId
        );

        if (affected == 0) {
            throw new ResourceNotFoundException("Notification not found with ID: " + notificationId);
        }
    }
}
