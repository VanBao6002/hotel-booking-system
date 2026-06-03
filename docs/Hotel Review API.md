# Hotel Review API

Public review endpoints used to read hotel review summaries and submit a review after booking.

## Base Path

`/api/reviews`

## Endpoints

### Get Review Summary

```http
GET /api/reviews/hotel/{hotelBranchId}
```

Response: `200 OK` with `HotelReviewResponse`

### Get Review List

```http
GET /api/reviews/hotel/{hotelBranchId}/list
```

Response: `200 OK` with `List<HotelReviewDTO>`

### Add Review

```http
POST /api/reviews/hotel/{hotelBranchId}
Content-Type: application/json
```

Request body fields used by the controller:

- `bookingId`
- `userId`
- `rating`
- `comment`
- `createdAt`

Response:

- `200 OK` with `ApiResponse` when the review is stored successfully
- `400 Bad Request` when persistence fails

## Notes

- After a successful review insert, the controller marks the booking as reviewed.
- The current flow expects the booking to be known at review time.

## Related Files

- [HotelReviewController.java](../backend/src/main/java/com/hotel/booking/controller/HotelReviewController.java)
- [HotelReviewService.java](../backend/src/main/java/com/hotel/booking/service/HotelReviewService.java)
