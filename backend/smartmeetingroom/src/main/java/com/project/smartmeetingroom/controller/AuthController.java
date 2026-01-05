package com.project.smartmeetingroom.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;

    public AuthController(
            UserRepository userRepo,
            JwtUtil jwtUtil,
            PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
        this.encoder = encoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        if (request.email() == null || request.password() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email and password are required"
            );
        }

        User user = userRepo.findByEmail(request.email())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
                )
            );

        if (!encoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password"
            );
        }

        // ✅ CORRECT FIX
        Long tenantId = user.getTenantId();

        String token = jwtUtil.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole(),
            tenantId
        );

        return ResponseEntity.ok(
            new LoginResponse(token, user)
        );
    }
}
