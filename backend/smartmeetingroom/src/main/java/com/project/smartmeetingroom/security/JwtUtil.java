package com.project.smartmeetingroom.security;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    // Token validity: 24 hours
    private static final long JWT_EXPIRATION_MS = 24 * 60 * 60 * 1000;

    // Secret key (for now hardcoded, later move to env)
    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Generate token
    public String generateToken(Long userId, Long tenantId, String role) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("tenantId", tenantId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    // Extract all claims
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract userId
    public Long getUserId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    // Validate token
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
