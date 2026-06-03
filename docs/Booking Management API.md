# Booking Management API

Admin booking management endpoints for searching and inspecting bookings.

## Base Path

`/api/v1/bookings`

## Endpoints

### Get All Bookings

```http
GET /api/v1/bookings?page={page}&pageSize={pageSize}&status={status}
```

Query params are optional and currently accepted by the controller.

Response: `200 OK` with `List<BookingDTO>`

### Get Booking By Id

```http
GET /api/v1/bookings/{bookingId}
```

Response: `200 OK` with `BookingDTO`

### Search Bookings

```http
POST /api/v1/bookings/search
Content-Type: application/json
```

Request body fields:

- `searchId`
- `guestName`
- `hotel`
- `startDate`
- `endDate`

Response: `200 OK` with `List<BookingDTO>`

## Example

```bash
curl -X POST "http://localhost:8080/api/v1/bookings/search" \
  -H "Content-Type: application/json" \
  -d '{"guestName":"John","hotel":"Oceanfront"}'
```

## Related Files

- [BookingManagementController.java](../backend/src/main/java/com/hotel/booking/controller/BookingManagementController.java)
- [BookingManagementService.java](../backend/src/main/java/com/hotel/booking/service/BookingManagementService.java)
