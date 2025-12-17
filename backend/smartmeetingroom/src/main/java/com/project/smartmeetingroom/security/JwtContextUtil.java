package com.project.smartmeetingroom.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;

@Component
public class JwtContextUtil {

    public Long getUserId() {
        Claims claims = (Claims) SecurityContextHolder.getContext()
                .getAuthentication()
                .getDetails();
        return Long.parseLong(claims.getSubject());
    }

    public Long getTenantId() {
        Claims claims = (Claims) SecurityContextHolder.getContext()
                .getAuthentication()
                .getDetails();
        return claims.get("tenantId", Long.class);
    }

    public String getRole() {
        Claims claims = (Claims) SecurityContextHolder.getContext()
                .getAuthentication()
                .getDetails();
        return claims.get("role", String.class);
    }
}
