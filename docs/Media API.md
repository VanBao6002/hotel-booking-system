## Room Media API

Use this endpoint to upload a hotel room image, GIF, or video and store the public URL in the database.

* ONLY ADMIN CAN UPLOAD MEDIA, THE OTHER ROLE HAVE NO PERMISSION.

### Upload Room Media

```http
POST /api/v1/rooms/{roomId}/media
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

file=<binary file>
```

Supported file types:

- Images: `png`, `jpg`, `jpeg`, `gif`
- Videos: `mp4`, `webm`, `mov`

Example with `curl`:

```bash
curl -X POST "http://localhost:8080/api/v1/rooms/1/media" \
  -H "Authorization: Bearer <jwt-token>" \
  -F "file=@./room1.png"
```

Success response (`200 OK`):

```json
{
  "roomId": 1,
  "mediaUrl": "/media/rooms/6f2ceff8-7a7a-4b6b-8e4d-ec7d7f2d5b9d.png",
  "contentType": "image/png",
  "fileSize": 145982
}
```

### Usage Notes

- The uploaded file is stored on disk under `backend/uploads/rooms` in local development.
- In Docker, the folder is mounted to `/app/uploads` so files survive container restarts.
- The public file URL is served under `http://localhost:8080/media/rooms/...`.
- The backend stores the URL in the `room_img` column.
- The current implementation stores one active media path per room.
- If you need multiple images per room later, add a separate room media table instead of overwriting one field.

## Related Files

- [RoomMediaController.java](../backend/src/main/java/com/hotel/booking/controller/RoomMediaController.java)
- [RoomMediaService.java](../backend/src/main/java/com/hotel/booking/service/RoomMediaService.java)
- [WebConfig.java](../backend/src/main/java/com/hotel/booking/config/WebConfig.java)
- [application.yaml](../backend/src/main/resources/application.yaml)
