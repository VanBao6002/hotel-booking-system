# Booking API

Public booking endpoints used by guests to create a booking and review their own booking history.

## Base Path

`/api/bookings`

## Endpoints

### Create Booking

```http
POST /api/bookings
Content-Type: application/json
```

Request body: `BookingRequest`

Response: `200 OK` with `ApiResponse`

### Get User Bookings

```http
GET /api/bookings/user/{userId}
```

Response: `200 OK` with `List<BookingDTO>`

## Example

```bash
curl "http://localhost:8080/api/bookings/user/1"
```

## Notes

- The booking creation flow is public according to the current access policy.
- User booking history is returned directly as a list of booking DTOs.

## Related Files

- [BookingController.java](../backend/src/main/java/com/hotel/booking/controller/BookingController.java)
- [BookingService.java](../backend/src/main/java/com/hotel/booking/service/BookingService.java)
