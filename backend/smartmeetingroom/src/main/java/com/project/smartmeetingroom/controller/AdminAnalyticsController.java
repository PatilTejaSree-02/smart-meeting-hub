package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.AdminAnalyticsResponse;
import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.AdminAnalyticsService;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;
    private final JwtContextUtil jwt;

    public AdminAnalyticsController(AdminAnalyticsService analyticsService, JwtContextUtil jwt) {
        this.analyticsService = analyticsService;
        this.jwt = jwt;
    }

    @GetMapping
    public AdminAnalyticsResponse analytics() {
        return analyticsService.getAnalytics(jwt.getTenantId());
    }
}
