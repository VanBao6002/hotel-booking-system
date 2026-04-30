# API Documentation

This document reflects the **current implemented backend APIs**.

## Base URL

`http://localhost:8080`

## Frontend Integration Context

- Current frontend is a static HTML/CSS/JavaScript app served at `http://localhost:3000`.
- Backend API is consumed over HTTP from the browser (CORS is required for integration).
- At the moment, frontend API wiring is still in progress; this document remains backend-first.

## Implemented Endpoints

## Authentication & Authorization

Current security behavior:

- Stateless JWT authentication is enabled.
- Public endpoints (no token required):
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/reset-password`
  - Swagger/OpenAPI endpoints
- Protected endpoints (require `Authorization: Bearer <jwt-token>`):
  - `GET /api/v1/auth/me`
  - `PUT /api/v1/auth/change-password`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/users`
  - `GET /api/v1/users/by-phone-number/{phoneNumber}`
  - `PUT /api/v1/users/update-profile/{phoneNumber}`

If token is missing/invalid on protected routes, API returns `401 Unauthorized`.

## User APIs

### Get User by Phone Number

```http
GET /api/v1/users/by-phone-number/{phoneNumber}
Authorization: Bearer <jwt-token>
```

Example:

```http
GET /api/v1/users/by-phone-number/0123456789
Authorization: Bearer <jwt-token>
```

Success response (`200 OK`):

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "phoneNumber": "0123456789",
  "dateOfBirth": "1996-08-21",
  "currentAddress": "Bangkok",
  "lockedUntil": null,
  "role": "USER"
}
```

Notes:

- If phone number exists, API returns user DTO (without password hash).
- If phone number does not exist, API returns `404 Not Found` with standardized error body.

### Get All Users

```http
GET /api/v1/users
Authorization: Bearer <jwt-token>
```

Success response (`200 OK`):

```json
[
  {
    "id": 1,
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0123456789",
    "dateOfBirth": "1996-08-21",
    "currentAddress": "Bangkok",
    "lockedUntil": null,
    "role": "USER"
  }
]
```

### Update Profile by Current Phone Number

```http
PUT /api/v1/users/update-profile/{phoneNumber}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "dateOfBirth": "1996-08-21",
  "genderId": 1,
  "phoneNumber": "0987654321",
  "currentAddress": "Bangkok",
  "countryId": 66
}
```

Notes:

- The path parameter identifies the current user record.
- The `phoneNumber` in the request body is the new value to store.
- Email remains optional; blank email is treated as missing.

## Planned (Not Implemented Yet)

The following sections are planned and currently **not available** in source code:

- Hotels (`/api/hotels/...`)
- Rooms (`/api/rooms/...`)
- Bookings (`/api/bookings/...`)
- Check-in / Check-out
- Health endpoint (`/api/health`)

## Authentication APIs

The following auth endpoints are currently implemented in backend source code.

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "password": "password123",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "phoneNumber": "0123456789"
}
```

Success response (`200 OK`):

```json
{
  "id": 7,
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "phoneNumber": "0123456789",
  "dateOfBirth": null,
  "currentAddress": null,
  "lockedUntil": null,
  "role": "USER"
}
```

Notes:

- `email` is optional.
- `phoneNumber` is required and must be unique.

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "phoneNumberOrEmail": "0123456789",
  "password": "password123"
}
```

Example success response:

```json
{
  "accessToken": "<jwt-token>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "phoneNumber": "0123456789",
    "dateOfBirth": "1996-08-21",
    "currentAddress": "Bangkok",
    "lockedUntil": null,
    "role": "USER"
  }
}
```

Notes:

- `accessToken` is a JWT.
- `tokenType` is always `Bearer`.
- `expiresIn` is configured by `jwt.access-token-expiration-seconds`.
- Login accepts either `phoneNumber` or `email` in the `phoneNumberOrEmail` field.

### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "phoneNumber": "0905123456"
}
```

Example success response (`200 OK`):

```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

MVP note:

- The API does not return a reset token in the response.
- If `email` is missing or blank, the backend still returns the same message.
- If the email exists, the reset token is generated internally for the reset flow.

### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "phoneNumber": "0905123456,
  "resetOtp": "123456",
  "newPassword": "newPassword"
}
```

Success response: `204 No Content`

### Logout
MVP note:

- Client-side will drop the token (Stateless JWT logout) 

### Get Current User (Me)

```http
GET /api/v1/auth/me
Authorization: Bearer <jwt-token>
```

Success response (`200 OK`):

```json
{
  "id": 1,
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "phoneNumber": "0123456789",
  "dateOfBirth": "1996-08-21",
  "currentAddress": "Bangkok",
  "lockedUntil": null,
  "role": "USER"
}
```

### Change Password

```http
PUT /api/v1/auth/change-password
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

Success response: `204 No Content`

## Error Response (Current)

Error format is standardized by global exception handling.

Example:

```json
{
  "timestamp": "2026-03-30T08:12:19.711383444",
  "status": 401,
  "error": "Unauthorized",
  "message": "Phone number or email or password not match",
  "path": "/api/v1/auth/login"
}
```

