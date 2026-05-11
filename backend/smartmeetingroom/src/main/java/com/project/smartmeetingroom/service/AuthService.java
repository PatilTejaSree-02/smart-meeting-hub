package com.project.smartmeetingroom.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.dto.SignupRequest;

import com.project.smartmeetingroom.entity.Tenant;
import com.project.smartmeetingroom.entity.User;

import com.project.smartmeetingroom.repository.TenantRepository;
import com.project.smartmeetingroom.repository.UserRepository;

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
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /* ================= LOGIN ================= */

    public LoginResponse login(LoginRequest request) {

        if (
                request.getEmail() == null ||
                request.getPassword() == null ||
                request.getTenant() == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email, password or tenant missing"
            );
        }

        // Find tenant
        Tenant tenant = tenantRepository
                .findBySubdomain(request.getTenant())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid tenant"
                        )
                );

        // Find user
        User user = userRepository
                .findByEmailAndTenantId(
                        request.getEmail(),
                        tenant.getId()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid credentials"
                        )
                );

        // Check active status
        if (user.getStatus() != User.Status.active) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User inactive"
            );
        }

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }

        // Generate token
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

    /* ================= SIGNUP ================= */

    public void signup(SignupRequest request) {

        // Find tenant/company
        Tenant tenant = tenantRepository
                .findBySubdomain(request.getSubdomain())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Company not found"
                        )
                );

        // Check if user already exists
        boolean exists = userRepository
                .findByEmailAndTenantId(
                        request.getEmail(),
                        tenant.getId()
                )
                .isPresent();

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User already exists"
            );
        }

        // Create user
        User user = new User();

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setEmail(request.getEmail());

        user.setDepartment(request.getDepartment());

        // Encrypt password
        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setTenantId(tenant.getId());

        // Default role
        user.setRole("ROLE_USER");

        // Default status
        user.setStatus(User.Status.active);

        // Save user
        userRepository.save(user);
    }
}