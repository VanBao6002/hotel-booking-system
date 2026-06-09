package com.hotel.booking.service;

import com.hotel.booking.dto.HotelBranchDTO;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.repository.HotelBranchRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class HotelMediaService {

    private static final Set<String> ALLOWED_MIME_PREFIXES = Set.of("image/", "video/");

    private final HotelBranchRepository hotelRepository;
    private final Path storagePath;
    private final String publicBasePath;

    public HotelMediaService(
            HotelBranchRepository hotelRepository,
            @Value("${app.media.hotels-storage-dir:./uploads/hotels}") String storageDir,
            @Value("${app.media.hotels-public-path:/media/hotels}") String publicBasePath) {
        this.hotelRepository = hotelRepository;
        this.storagePath = Paths.get(storageDir).toAbsolutePath().normalize();
        this.publicBasePath = normalizePublicBasePath(publicBasePath);
    }

    public HotelMediaUploadResult uploadHotelMedia(int hotelId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Media file is required");
        }

        HotelBranchDTO hotel = hotelRepository.getHotelBranchById(hotelId);
        if (hotel == null) {
            throw new ResourceNotFoundException("Hotel not found with id " + hotelId);
        }

        String contentType = file.getContentType();
        if (contentType == null || ALLOWED_MIME_PREFIXES.stream().noneMatch(contentType::startsWith)) {
            throw new IllegalArgumentException("Only image/* and video/* files are supported");
        }

        Files.createDirectories(storagePath);

        String extension = resolveExtension(file.getOriginalFilename(), contentType);
        String storedFileName = UUID.randomUUID() + extension;
        Path targetPath = storagePath.resolve(storedFileName).normalize();

        if (!targetPath.startsWith(storagePath)) {
            throw new IllegalArgumentException("Invalid media file name");
        }

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            String mediaUrl = publicBasePath + "/" + storedFileName;
            hotelRepository.updateHotelImage(hotelId, mediaUrl);
            return new HotelMediaUploadResult(hotelId, mediaUrl, contentType, file.getSize());
        } catch (IOException | RuntimeException ex) {
            Files.deleteIfExists(targetPath);
            throw ex;
        }
    }

    private String resolveExtension(String originalFilename, String contentType) {
        if (originalFilename != null && originalFilename.contains(".")) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
            if (extension.matches("\\.[a-z0-9]{1,6}")) {
                return extension;
            }
        }

        if ("image/png".equalsIgnoreCase(contentType)) {
            return ".png";
        }
        if ("image/jpeg".equalsIgnoreCase(contentType)) {
            return ".jpg";
        }
        if ("image/gif".equalsIgnoreCase(contentType)) {
            return ".gif";
        }
        if ("video/mp4".equalsIgnoreCase(contentType)) {
            return ".mp4";
        }
        if ("video/webm".equalsIgnoreCase(contentType)) {
            return ".webm";
        }
        if ("video/quicktime".equalsIgnoreCase(contentType)) {
            return ".mov";
        }

        return ".bin";
    }

    private String normalizePublicBasePath(String basePath) {
        String normalized = basePath.trim();
        if (!normalized.startsWith("/")) {
            normalized = "/" + normalized;
        }
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    public record HotelMediaUploadResult(int hotelId, String mediaUrl, String contentType, long fileSize) {
    }
}
