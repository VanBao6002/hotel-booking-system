# Auth API

Authentication and account lifecycle endpoints.

Public endpoints: register, login, forgot password, reset password.
Protected endpoints: change password, logout, me.

## Base Path

`/api/v1/auth`

## Endpoints

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

Request body: `RegisterRequest`

Response: `200 OK` with `UserDTO`

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

Request body: `LoginRequest`

Response: `200 OK` with `LoginResponse`

### Forgot Password

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json
```

Request body: `ForgotPasswordRequest`

Response: `200 OK` with `ForgotPasswordResponse`

### Reset Password

```http
POST /api/v1/auth/reset-password
Content-Type: application/json
```

Request body: `ResetPasswordRequest`

Response: `204 No Content`

### Change Password

```http
PUT /api/v1/auth/change-password
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Request body: `ChangePasswordRequest`

Response: `204 No Content`

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <jwt-token>
```

Response: `204 No Content`

### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <jwt-token>
```

Response: `200 OK` with `UserDTO`

## Example

```bash
curl -X POST "http://localhost:8080/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumberOrEmail":"0900000000","password":"secret"}'
```

## Related Files

- [AuthController.java](../backend/src/main/java/com/hotel/booking/controller/AuthController.java)
- [AuthService.java](../backend/src/main/java/com/hotel/booking/service/AuthService.java)
- [RequestAccessPolicy.java](../backend/src/main/java/com/hotel/booking/config/RequestAccessPolicy.java)
