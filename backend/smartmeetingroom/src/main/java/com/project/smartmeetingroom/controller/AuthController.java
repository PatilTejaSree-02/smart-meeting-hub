package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.AdminSignupRequest;
import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.dto.SignupRequest;

import com.project.smartmeetingroom.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    /* ================= LOGIN ================= */

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    /* ================= EMPLOYEE SIGNUP ================= */

    @PostMapping("/signup")
    public String signup(
            @RequestBody SignupRequest request
    ) {

        authService.signup(request);

        return "User registered successfully";
    }

    /* ================= ADMIN SIGNUP ================= */

    @PostMapping("/admin-signup")
    public String adminSignup(
            @RequestBody AdminSignupRequest request
    ) {

        return authService.adminSignup(request);
    }
}