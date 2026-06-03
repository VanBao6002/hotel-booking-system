# Search Hotel API

Public hotel availability search endpoint.

## Base Path

`/api/search`

## Endpoints

### Search Available Hotels

```http
POST /api/search/hotel
Content-Type: application/json
```

Request body fields used by the controller:

- `checkInDate`
- `checkOutDate`
- `singleRoomQuantity`
- `doubleRoomQuantity`
- `location`

Response: `200 OK` with `SearchResponse`

## Example

```bash
curl -X POST "http://localhost:8080/api/search/hotel" \
  -H "Content-Type: application/json" \
  -d '{"checkInDate":"2026-06-10","checkOutDate":"2026-06-12","singleRoomQuantity":1,"doubleRoomQuantity":0,"location":"Da Nang"}'
```

## Related Files

- [HotelBranchController.java](../backend/src/main/java/com/hotel/booking/controller/HotelBranchController.java)
- [HotelBranchService.java](../backend/src/main/java/com/hotel/booking/service/HotelBranchService.java)
