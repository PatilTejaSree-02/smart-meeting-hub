package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.DashboardStatsResponse;
import com.project.smartmeetingroom.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // TEMP: tenantId passed explicitly (no auth, no mock)
    @GetMapping("/stats")
    public DashboardStatsResponse getDashboardStats(
            @RequestParam Long tenantId
    ) {
        return dashboardService.getStats(tenantId);
    }
}
