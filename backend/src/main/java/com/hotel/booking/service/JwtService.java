package com.hotel.booking.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hotel.booking.exception.UnauthorizedException;
import com.hotel.booking.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.access-token-expiration-seconds}")
	private long accessTokenExpirationSeconds;

	@Value("${jwt.reset-token-expiration-seconds}")
	private long resetTokenExpirationSeconds;

	/**
	 * Builds a signed access token for authenticated API calls.
	 */
	public String generateAccessToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plusSeconds(accessTokenExpirationSeconds);

		return Jwts.builder()
			.subject(user.getUserName())
			.claim("userId", user.getId())
			.claim("email", user.getEmail())
			.issuedAt(Date.from(now))
			.expiration(Date.from(expiresAt))
			.signWith(getSigningKey())
			.compact();
	}
	
	/** 
	 * Validates an access token and returns its subject (username).
	 */
	public String extractSubject(String token) {
		try {
			return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.getSubject();
		} catch (Exception ex) {
			throw new UnauthorizedException("Invalid or expired access token");
		}
	}

	/**
	 * Builds a signed short-lived token used only for password reset.
	 */
	public String generateResetPasswordToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plusSeconds(resetTokenExpirationSeconds);

		return Jwts.builder()
			.subject(user.getEmail())
			.claim("purpose", "RESET_PASSWORD")
			.issuedAt(Date.from(now))
			.expiration(Date.from(expiresAt))
			.signWith(getSigningKey())
			.compact();
	}

	/**
	 * Validates a reset token, checks its purpose claim, and returns email subject.
	 */
	public String extractEmailFromResetToken(String token) {
		try {
			var claims = Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();

			Object purpose = claims.get("purpose");
			if (!"RESET_PASSWORD".equals(purpose)) {
				throw new UnauthorizedException("Invalid reset token purpose");
			}

			return claims.getSubject();
		} catch (UnauthorizedException ex) {
			throw ex;
		} catch (Exception ex) {
			throw new UnauthorizedException("Invalid or expired reset token");
		}
	}

	/**
	 * Returns access token lifetime in seconds for API responses.
	 */
	public long getAccessTokenExpiresInSeconds() {
		return accessTokenExpirationSeconds;
	}

	/**
	 * Returns reset token lifetime in seconds for API responses.
	 */
	public long getResetTokenExpiresInSeconds() {
		return resetTokenExpirationSeconds;
	}

	/**
	 * Creates the HMAC signing key from configured secret.
	 */
	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
	}

	/**
	 * Extracts bearer token value from Authorization header and validates format.
	 */
	public String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new UnauthorizedException("Missing Authorization header");
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authorization header must start with Bearer");
        }

        String token = authorizationHeader.substring(7).trim();
        if (token.isEmpty()) {
            throw new UnauthorizedException("Bearer token is missing");
        }

        return token;
    }
}
