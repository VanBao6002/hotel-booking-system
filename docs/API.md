# API Documentation

This document reflects the **current implemented backend APIs**.

## Base URL

`http://localhost:8080`

## Implemented Endpoints

### Get User by Username

```http
GET /api/v1/users/by-username/{userName}
```

Example:

```http
GET /api/v1/users/by-username/john_doe
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
- If username does not exist, current implementation throws runtime exception and returns `500`.
- Planned improvement: return `404 Not Found` with standardized error body.

## Planned (Not Implemented Yet)

The following sections are planned and currently **not available** in source code:

- Authentication (`/api/v1/auth/...`)
- Hotels (`/api/hotels/...`)
- Rooms (`/api/rooms/...`)
- Bookings (`/api/bookings/...`)
- Check-in / Check-out
- Health endpoint (`/api/health`)

## Planned Authentication APIs (MVP)

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "userName": "john_doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "fullName": "John Doe"
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

### Recommended Next APIs (After MVP)

- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

## Error Response (Current)

Error format is not standardized yet. Depending on exception type, Spring Boot default error response is returned.

## Interactive Documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

If Swagger shows no endpoints, rebuild and restart backend:

```bash
docker compose up --build -d backend
```