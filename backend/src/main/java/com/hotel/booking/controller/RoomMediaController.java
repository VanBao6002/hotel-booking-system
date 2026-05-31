package com.hotel.booking.controller;

import com.hotel.booking.service.RoomMediaService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomMediaController {

    private final RoomMediaService roomMediaService;

    public RoomMediaController(RoomMediaService roomMediaService) {
        this.roomMediaService = roomMediaService;
    }

    @PostMapping(value = "/{roomId}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RoomMediaService.RoomMediaUploadResult> uploadRoomMedia(
            @PathVariable int roomId,
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(roomMediaService.uploadRoomMedia(roomId, file));
    }
}