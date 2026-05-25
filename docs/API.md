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
  - `GET /api/v1/users/by-username/{userName}`

If token is missing/invalid on protected routes, API returns `401 Unauthorized`.

## User APIs

### Get User by Username

```http
GET /api/v1/users/by-username/{userName}
Authorization: Bearer <jwt-token>
```

Example:

```http
GET /api/v1/users/by-username/john_doe
Authorization: Bearer <jwt-token>
```

Success response (`200 OK`):

```json
{
  "id": 1,
  "userName": "john_doe",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2026-03-24T14:25:32"
}
```

Notes:

- If username exists, API returns user DTO (without password hash).
- If username does not exist, API returns `404 Not Found` with standardized error body.

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
    "userName": "john_doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2026-03-24T14:25:32"
  }
]
```

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
  "userName": "john_doe",
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
  "userName": "john_doe",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2026-03-30T08:00:00"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "userNameOrEmail": "john_doe",
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
    "userName": "john_doe",
    "email": "john.doe@example.com",
    "fullName": "John Doe"
  }
}
```

Notes:

- `accessToken` is a JWT.
- `tokenType` is always `Bearer`.
- `expiresIn` is configured by `jwt.access-token-expiration-seconds`.

### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```

Example success response (`200 OK`):

```json
{
  "resetToken": "<reset-jwt-token>",
  "expiresIn": 900
}
```

MVP note:

- For local development, reset token is returned in API response.
- In production, this token should be delivered by email and not returned directly.

### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "resetToken": "<reset-jwt-token>",
  "newPassword": "newPassword456"
}
```

Success response: `204 No Content`

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <jwt-token>
```

MVP note:

- Stateless JWT logout can be handled client-side by deleting the token.
- Optional phase 2: server-side token blacklist/revocation.

### Get Current User (Me)

```http
GET /api/v1/auth/me
Authorization: Bearer <jwt-token>
```

Success response (`200 OK`):

```json
{
  "id": 1,
  "userName": "john_doe",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2026-03-24T14:25:32"
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

## Auth APIs Not Implemented Yet

- `POST /api/v1/auth/refresh-token`

## Error Response (Current)

Error format is standardized by global exception handling.

Example:

```json
{
  "timestamp": "2026-03-30T08:12:19.711383444",
  "status": 401,
  "error": "Unauthorized",
  "message": "Username or password not match",
  "path": "/api/v1/auth/login"
}
```

## Interactive Documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

If Swagger shows no endpoints, rebuild and restart backend:

```bash
docker compose up --build -d backend
```