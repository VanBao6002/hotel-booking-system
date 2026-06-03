# Staff Workspace API

Staff-facing workspace endpoints scoped to the authenticated user.

## Base Path

`/api/v1/staff`

## Endpoints

### Dashboard

```http
GET /api/v1/staff/dashboard
Authorization: Bearer <jwt-token>
```

Response: `200 OK` with `StaffDashboardDTO`

### Assigned Hotel

```http
GET /api/v1/staff/hotel
Authorization: Bearer <jwt-token>
```

Response: `200 OK` with `HotelBranchDTO`

### Assigned Rooms

```http
GET /api/v1/staff/rooms
Authorization: Bearer <jwt-token>
```

Response: `200 OK` with `List<RoomDTO>`

### Update Assigned Room Status

```http
PUT /api/v1/staff/rooms/{roomId}/status
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Request body:

```json
{ "roomStatus": "AVAILABLE" }
```

Response: `200 OK` with `RoomDTO`

### Assigned Bookings

```http
GET /api/v1/staff/bookings
Authorization: Bearer <jwt-token>
```

Response: `200 OK` with `List<BookingDTO>`

### Search Assigned Bookings

```http
POST /api/v1/staff/bookings/search
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Request body fields:

- `searchId`
- `guestName`
- `startDate`
- `endDate`

Response: `200 OK` with `List<BookingDTO>`

## Notes

- These endpoints use the authenticated principal name to resolve the staff member's assignment.
- No explicit user ID is passed in the path; access is derived from the JWT identity.

## Related Files

- [StaffWorkspaceController.java](../backend/src/main/java/com/hotel/booking/controller/StaffWorkspaceController.java)
- [StaffWorkspaceService.java](../backend/src/main/java/com/hotel/booking/service/StaffWorkspaceService.java)
