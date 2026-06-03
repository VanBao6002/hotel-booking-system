package com.hotel.booking.repository;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaInspector {
    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaInspector(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean tableExists(String tableName) {
        return Boolean.TRUE.equals(jdbcTemplate.execute((ConnectionCallback<Boolean>) connection -> {
            String[] catalogs = nullableVariants(connection.getCatalog());
            String[] schemas = nullableVariants(resolveSchema(connection));
            String[] tableVariants = caseVariants(tableName);

            for (String catalog : catalogs) {
                for (String schema : schemas) {
                    for (String tableVariant : tableVariants) {
                        try (ResultSet rs = connection.getMetaData().getTables(catalog, schema, tableVariant, null)) {
                            while (rs.next()) {
                                if (tableName.equalsIgnoreCase(rs.getString("TABLE_NAME"))) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }));
    }

    public boolean columnExists(String tableName, String columnName) {
        return Boolean.TRUE.equals(jdbcTemplate.execute((ConnectionCallback<Boolean>) connection -> {
            String[] catalogs = nullableVariants(connection.getCatalog());
            String[] schemas = nullableVariants(resolveSchema(connection));
            String[] tableVariants = caseVariants(tableName);
            String[] columnVariants = caseVariants(columnName);

            for (String catalog : catalogs) {
                for (String schema : schemas) {
                    for (String tableVariant : tableVariants) {
                        for (String columnVariant : columnVariants) {
                            try (ResultSet rs = connection.getMetaData().getColumns(catalog, schema, tableVariant, columnVariant)) {
                                while (rs.next()) {
                                    if (tableName.equalsIgnoreCase(rs.getString("TABLE_NAME"))
                                        && columnName.equalsIgnoreCase(rs.getString("COLUMN_NAME"))) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }));
    }

    private String resolveSchema(java.sql.Connection connection) {
        try {
            return connection.getSchema();
        } catch (SQLException ex) {
            return null;
        }
    }

    private String[] nullableVariants(String value) {
        return value == null || value.isBlank()
            ? new String[] { null }
            : new String[] { value, null };
    }

    private String[] caseVariants(String value) {
        return new String[] { value, value.toLowerCase(), value.toUpperCase() };
    }
}
