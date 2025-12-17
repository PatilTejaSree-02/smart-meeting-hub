package com.project.smartmeetingroom.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        if (!"active".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403).body("User account inactive");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getTenantId(),
                user.getRole()
        );

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getTenantId(),
                user.getRole(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}
