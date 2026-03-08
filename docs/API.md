# API Documentation

Base URL: `http://localhost:8080/api`

## Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "firstName": "John"
}
```

## Hotels

### Get All Hotels
```http
GET /api/hotels
```

### Get Hotel by ID
```http
GET /api/hotels/{id}
```

### Search Hotels
```http
GET /api/hotels/search?city=Miami&checkIn=2026-03-15&checkOut=2026-03-18
```

## Rooms

### Get All Rooms
```http
GET /api/rooms
```

### Get Room by ID
```http
GET /api/rooms/{id}
```

### Get Available Rooms
```http
GET /api/rooms/available?hotelId=1&checkIn=2026-03-15&checkOut=2026-03-18&capacity=2
```

## Bookings

### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomId": 1,
  "checkIn": "2026-03-15",
  "checkOut": "2026-03-18",
  "totalPrice": 360.00
}
```

### Get User Bookings
```http
GET /api/bookings/my
Authorization: Bearer {token}
```

### Get Booking by ID
```http
GET /api/bookings/{id}
Authorization: Bearer {token}
```

### Cancel Booking
```http
DELETE /api/bookings/{id}
Authorization: Bearer {token}
```

### Update Booking Status
```http
PUT /api/bookings/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

## Check-in / Check-out

### Check-in
```http
POST /api/checkin
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 1
}
```

### Check-out
```http
POST /api/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": 1
}
```

## Health Check

### Service Status
```http
GET /api/health
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "timestamp": "2026-03-07T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input data",
  "path": "/api/bookings"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Interactive Documentation

For interactive API documentation, visit:
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs  