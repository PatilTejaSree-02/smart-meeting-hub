package com.project.smartmeetingroom.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.entity.Tenant;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.repository.TenantRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            TenantRepository tenantRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        if (request.getEmail() == null || 
            request.getPassword() == null || 
            request.getTenant() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Email, password or tenant missing"
            );
        }

        // 1️⃣ Find tenant
        Tenant tenant = tenantRepository.findBySubdomain(request.getTenant())
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid tenant")
            );

        // 2️⃣ Find user inside that tenant
        User user = userRepository
                .findByEmailAndTenantId(request.getEmail(), tenant.getId())
                .orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
                );

        // 3️⃣ Check status
        if (user.getStatus() != User.Status.active) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User inactive");
        }

        // 4️⃣ Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // 5️⃣ Generate token
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getTenantId()
        );

        return new LoginResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getRole(),
            user.getTenantId()
        );
    }
}
