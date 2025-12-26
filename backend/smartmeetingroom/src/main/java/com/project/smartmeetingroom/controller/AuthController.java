package com.project.smartmeetingroom.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081") // Frontend URL
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * ✅ LOGIN ENDPOINT
     * This handles authentication of users.
     * It checks the email & password, and returns a JWT token if valid.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        User user = userOpt.get();

        // Verify password (BCrypt hash)
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        // Check user status
        if (!"active".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User account inactive");
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getTenantId(),
                user.getRole()
        );

        // Build response object
        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getTenantId(),
                user.getRole(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * ✅ REGISTER ENDPOINT
     * Optional — allows creation of a new user.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already exists");
        }

        // Create new user
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("user");
        newUser.setStatus("active");

        userRepository.save(newUser);

        String token = jwtUtil.generateToken(
                newUser.getId(),
                newUser.getTenantId(),
                newUser.getRole()
        );

        LoginResponse response = new LoginResponse(
                token,
                newUser.getId(),
                newUser.getTenantId(),
                newUser.getRole(),
                newUser.getEmail()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
