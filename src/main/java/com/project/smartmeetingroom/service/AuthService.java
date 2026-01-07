package com.project.smartmeetingroom.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmailAndTenantId(request.getEmail(), request.getTenantId())
                .orElseThrow(() -> new RuntimeException("Invalid email or tenant"));

        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getTenantId()
        );

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getTenantId(),
                token
        );
    }
}
