package com.hotel.booking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String roomsStorageDir;
    private final String roomsPublicPath;
    private final String hotelsStorageDir;
    private final String hotelsPublicPath;

    public WebConfig(
            @Value("${app.media.rooms-storage-dir:${app.media.storage-dir:./uploads/rooms}}") String roomsStorageDir,
            @Value("${app.media.rooms-public-path:${app.media.public-path:/media/rooms}}") String roomsPublicPath,
            @Value("${app.media.hotels-storage-dir:./uploads/hotels}") String hotelsStorageDir,
            @Value("${app.media.hotels-public-path:/media/hotels}") String hotelsPublicPath) {
        this.roomsStorageDir = roomsStorageDir;
        this.roomsPublicPath = roomsPublicPath.startsWith("/") ? roomsPublicPath : "/" + roomsPublicPath;
        this.hotelsStorageDir = hotelsStorageDir;
        this.hotelsPublicPath = hotelsPublicPath.startsWith("/") ? hotelsPublicPath : "/" + hotelsPublicPath;
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String roomsLocation = Paths.get(roomsStorageDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler(roomsPublicPath + "/**")
                .addResourceLocations(roomsLocation);

        String hotelsLocation = Paths.get(hotelsStorageDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler(hotelsPublicPath + "/**")
                .addResourceLocations(hotelsLocation);
    }
}