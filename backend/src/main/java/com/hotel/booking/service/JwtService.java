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

	public String extractSubject(String token) {
		return Jwts.parser()
			.verifyWith(getSigningKey())
			.build()
			.parseSignedClaims(token)
			.getPayload()
			.getSubject();
	}

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

	public long getAccessTokenExpiresInSeconds() {
		return accessTokenExpirationSeconds;
	}

	public long getResetTokenExpiresInSeconds() {
		return resetTokenExpirationSeconds;
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
	}
}
