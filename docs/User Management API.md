# User Management API

Admin user management endpoints.

## Base Path

`/api/v1/users`

## Endpoints

### Get User By Username

```http
GET /api/v1/users/by-username/{userName}
```

Response: `200 OK` with `UserDTO`

### Get All Users

```http
GET /api/v1/users
```

Response: `200 OK` with `List<UserDTO>`

### Delete User

```http
DELETE /api/v1/users/{userId}
```

Response: `204 No Content`

### Lock User

```http
PUT /api/v1/users/{userId}/lock
Content-Type: application/json
```

Request body:

```json
{ "reason": "Abuse or policy violation" }
```

Response: `200 OK` with `UserDTO`

### Warn User

```http
POST /api/v1/users/{userId}/warn
Content-Type: application/json
```

Request body:

```json
{ "message": "Please update your profile information" }
```

Response: `200 OK` with `UserDTO`

### Update User Role

```http
PUT /api/v1/users/{userId}/role
Content-Type: application/json
```

Request body fields used by the controller:

- `role`
- `hotelBranchId`

Response: `200 OK` with `UserDTO`

## Notes

- If `role` is omitted, the controller defaults to `staff`.
- `hotelBranchId` is optional and can be omitted when not assigning a staff member to a branch.

## Related Files

- [UserController.java](../backend/src/main/java/com/hotel/booking/controller/UserController.java)
- [UserService.java](../backend/src/main/java/com/hotel/booking/service/UserService.java)
