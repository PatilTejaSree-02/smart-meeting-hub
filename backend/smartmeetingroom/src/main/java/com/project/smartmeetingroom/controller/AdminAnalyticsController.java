package com.project.smartmeetingroom.controller;

import com.project.smartmeetingroom.dto.AdminAnalyticsResponse;
import com.project.smartmeetingroom.service.AdminAnalyticsService;
import com.project.smartmeetingroom.security.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminAnalyticsController {

    private final AdminAnalyticsService service;
    private final JwtUtil jwtUtil;

    public AdminAnalyticsController(AdminAnalyticsService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse getAnalytics(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Claims claims = jwtUtil.extractClaims(token);

        Long tenantId = claims.get("tenantId", Long.class);

        return service.getAnalytics(tenantId);
    }
}
