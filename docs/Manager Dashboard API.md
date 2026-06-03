# Manager Dashboard API

Manager reporting endpoint for dashboard summaries.

## Base Path

`/api/v1/dashboard`

## Endpoints

### Manager Dashboard

```http
GET /api/v1/dashboard/manager?year={year}
```

Query param `year` is optional.

Response: `200 OK` with `ManagerDashboardDTO`

## Related Files

- [ManagerDashboardController.java](../backend/src/main/java/com/hotel/booking/controller/ManagerDashboardController.java)
- [ManagerDashboardService.java](../backend/src/main/java/com/hotel/booking/service/ManagerDashboardService.java)
