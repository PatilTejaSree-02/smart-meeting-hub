package com.project.smartmeetingroom.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    @GetMapping
    public Map<String, Object> analytics() {
        return Map.of(
            "message", "Analytics coming soon"
        );
    }
}
