# Backend Error Handling (Current Implementation)

This document describes all error-handling behavior currently implemented in:

- `backend/src/main/java/com/hotel/booking/exception`

## Error Response Shape

All handled errors are returned as a JSON body using `ApiErrorResponse`.

Fields:

- `timestamp` (LocalDateTime)
- `status` (HTTP numeric status)
- `error` (HTTP reason phrase)
- `message` (error details)
- `path` (request URI)

Example:

```json
{
  "timestamp": "2026-04-07T10:15:30.123",
  "status": 404,
  "error": "Not Found",
  "message": "Room not found",
  "path": "/api/rooms/999"
}
```

## Custom Exceptions

### ResourceNotFoundException

- Class: `ResourceNotFoundException extends RuntimeException`
- Constructor: takes `message`
- Mapped by global handler to:
  - Status: `404 Not Found`
  - Message: exception message

### ConflictException

- Class: `ConflictException extends RuntimeException`
- Constructor: takes `message`
- Mapped by global handler to:
  - Status: `409 Conflict`
  - Message: exception message

### UnauthorizedException

- Class: `UnauthorizedException extends RuntimeException`
- Constructor: takes `message`
- Mapped by global handler to:
  - Status: `401 Unauthorized`
  - Message: exception message

## Spring/Framework Exceptions Handled

### MethodArgumentNotValidException

- Status: `400 Bad Request`
- Message behavior: joins all validation field messages with `; `

### HttpMediaTypeNotSupportedException

- Status: `415 Unsupported Media Type`
- Message: `Content-Type must be application/json`

### HttpMessageNotReadableException

- Status: `400 Bad Request`
- Message: `Request body is invalid JSON`

### HttpRequestMethodNotSupportedException

- Status: `405 Method Not Allowed`
- Message: exception message from Spring

### MissingRequestHeaderException

- If missing header is `Authorization`:
  - Status: `401 Unauthorized`
  - Message: `Missing Authorization header`
- Otherwise:
  - Status: `400 Bad Request`
  - Message: exception message from Spring

## Fallback Handlers

### RuntimeException

- Status: `400 Bad Request`
- Message: runtime exception message

### Exception

- Status: `500 Internal Server Error`
- Message: `Unexpected server error`

## Source References

- `backend/src/main/java/com/hotel/booking/exception/ApiErrorResponse.java`
- `backend/src/main/java/com/hotel/booking/exception/ResourceNotFoundException.java`
- `backend/src/main/java/com/hotel/booking/exception/ConflictException.java`
- `backend/src/main/java/com/hotel/booking/exception/UnauthorizedException.java`
- `backend/src/main/java/com/hotel/booking/exception/GlobalExceptionHandler.java`
