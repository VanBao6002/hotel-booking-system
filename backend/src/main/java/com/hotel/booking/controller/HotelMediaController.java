package com.hotel.booking.controller;

import com.hotel.booking.service.HotelMediaService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelMediaController {

    private final HotelMediaService hotelMediaService;

    public HotelMediaController(HotelMediaService hotelMediaService) {
        this.hotelMediaService = hotelMediaService;
    }

    @PostMapping(value = "/{hotelId}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<HotelMediaService.HotelMediaUploadResult> uploadHotelMedia(
            @PathVariable int hotelId,
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(hotelMediaService.uploadHotelMedia(hotelId, file));
    }
}
