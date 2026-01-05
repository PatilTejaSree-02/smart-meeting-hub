package com.project.smartmeetingroom.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;

@Component
public class JwtContextUtil {

    private Claims claims() {
        return (Claims) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getDetails();
    }

    public Long getUserId() {
        return claims().get("userId", Long.class);
    }

    public Long getTenantId() {
        return claims().get("tenantId", Long.class);
    }

    public String getRole() {
        return claims().get("role", String.class);
    }
}
