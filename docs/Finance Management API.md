# Finance Management API

Admin finance reporting endpoints.

## Base Path

`/api/v1/finance`

## Endpoints

### Finance Summary

```http
GET /api/v1/finance/summary
```

Response: `200 OK` with `FinanceSummaryDTO`

### Transaction History

```http
GET /api/v1/finance/transactions?page={page}&pageSize={pageSize}&startDate={startDate}&endDate={endDate}
```

Query params are optional.

Response: `200 OK` with `List<TransactionDTO>`

### Monthly Revenue

```http
GET /api/v1/finance/monthly-revenue?year={year}
```

Response: `200 OK` with `MonthlyRevenueDTO`

## Related Files

- [FinanceManagementController.java](../backend/src/main/java/com/hotel/booking/controller/FinanceManagementController.java)
- [FinanceManagementService.java](../backend/src/main/java/com/hotel/booking/service/FinanceManagementService.java)
