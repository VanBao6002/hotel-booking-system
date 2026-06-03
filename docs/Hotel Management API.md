# Hotel Management API

Admin hotel and room management endpoints.

## Base Path

`/api/v1/hotels`

## Endpoints

### Get All Hotels

```http
GET /api/v1/hotels
```

Response: `200 OK` with `List<HotelBranchDTO>`

### Get Hotel By Id

```http
GET /api/v1/hotels/{hotelId}
```

Response: `200 OK` with `HotelBranchDTO`

### Create Hotel

```http
POST /api/v1/hotels
Content-Type: application/json
```

Request body: `HotelBranchDTO`

Response: `201 Created` with `HotelBranchDTO`

### Update Hotel

```http
PUT /api/v1/hotels/{hotelId}
Content-Type: application/json
```

Request body: `HotelBranchDTO`

Response: `200 OK` with `HotelBranchDTO`

### Delete Hotel

```http
DELETE /api/v1/hotels/{hotelId}
```

Response: `204 No Content`

### Get Hotel Rooms

```http
GET /api/v1/hotels/{hotelId}/rooms
```

Response: `200 OK` with `List<RoomDTO>`

### Add Room

```http
POST /api/v1/hotels/{hotelId}/rooms
Content-Type: application/json
```

Request body: `RoomDTO`

Response: `201 Created` with `RoomDTO`

### Update Room

```http
PUT /api/v1/hotels/{hotelId}/rooms/{roomId}
Content-Type: application/json
```

Request body: `RoomDTO`

Response: `200 OK` with `RoomDTO`

### Delete Room

```http
DELETE /api/v1/hotels/{hotelId}/rooms/{roomId}
```

Response: `204 No Content`

## Related Files

- [HotelManagementController.java](../backend/src/main/java/com/hotel/booking/controller/HotelManagementController.java)
- [HotelManagementService.java](../backend/src/main/java/com/hotel/booking/service/HotelManagementService.java)
