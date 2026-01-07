package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.security.JwtContextUtil;
import com.project.smartmeetingroom.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:8081")
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtContextUtil jwt;

    public DashboardController(
            DashboardService dashboardService,
            JwtContextUtil jwt
    ) {
        this.dashboardService = dashboardService;
        this.jwt = jwt;
    }

    // ---------------- USER DASHBOARD ----------------
    @GetMapping("/user")
    public DashboardService.UserDashboardData userDashboard() {
        return dashboardService.getUserDashboard(
                jwt.getUserId(),
                jwt.getTenantId()
        );
    }

    // ---------------- ADMIN DASHBOARD ----------------
    @GetMapping("/admin")
    public DashboardService.AdminDashboardData adminDashboard() {
        return dashboardService.getAdminDashboard(
                jwt.getTenantId()
        );
    }
}
