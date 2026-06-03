# Debug API

Internal debug endpoint for inspecting the last OTP message sent to a phone number.

## Base Path

`/internal/debug`

## Endpoints

### Get Last OTP

```http
GET /internal/debug/last-otp?phone={phone}
```

Response behavior:

- `200 OK` with the 6-digit OTP if one can be extracted from the last message
- `200 OK` with the raw last message if no OTP is present
- `204 No Content` if no message exists for the phone number

## Notes

- This endpoint is intended for internal development and troubleshooting only.
- It depends on `DebugSmsService` message history.

## Related Files

- [DebugController.java](../backend/src/main/java/com/hotel/booking/controller/DebugController.java)
- [DebugSmsService.java](../backend/src/main/java/com/hotel/booking/service/DebugSmsService.java)
