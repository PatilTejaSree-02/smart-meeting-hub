package com.project.smartmeetingroom.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.AdminSignupRequest;
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

        Tenant tenant = tenantRepository
                .findBySubdomain(request.getTenant())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid tenant"
                        )
                );

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

        if (user.getStatus() != User.Status.active) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "User inactive"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }

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

    /* ================= EMPLOYEE SIGNUP ================= */

    public void signup(SignupRequest request) {

        Tenant tenant = tenantRepository
                .findBySubdomain(request.getSubdomain())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Company not found"
                        )
                );

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

        User user = new User();

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setEmail(request.getEmail());

        user.setDepartment(request.getDepartment());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setTenantId(tenant.getId());

        user.setRole("ROLE_USER");

        user.setStatus(User.Status.active);

        userRepository.save(user);
    }

    /* ================= ADMIN SIGNUP ================= */

    public String adminSignup(
            AdminSignupRequest request
    ) {

        boolean tenantExists = tenantRepository
                .findBySubdomain(request.getSubdomain())
                .isPresent();

        if (tenantExists) {
            throw new RuntimeException(
                    "Company code already exists"
            );
        }

        Tenant tenant = new Tenant();

        tenant.setCompanyName(
                request.getCompanyName()
        );

        tenant.setSubdomain(
                request.getSubdomain()
        );

        tenant.setCompanyEmail(
                request.getEmail()
        );

        tenant.setStatus("ACTIVE");

        tenant.setPlanType("FREE");

        tenant.setMaxUsers(50);

        tenant.setMaxRooms(10);

        tenant.setMaxBookingsPerMonth(500);

        Tenant savedTenant =
                tenantRepository.save(tenant);

        boolean emailExists = userRepository
                .findUserByEmailOnly(request.getEmail())
                .isPresent();

        if (emailExists) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User admin = new User();

        admin.setTenantId(savedTenant.getId());

        admin.setFirstName(request.getFirstName());

        admin.setLastName(request.getLastName());

        admin.setEmail(request.getEmail());

        admin.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        admin.setDepartment(request.getDepartment());

        admin.setRole("ROLE_ADMIN");

        admin.setStatus(User.Status.active);

        userRepository.save(admin);

        return "Company Admin Registered Successfully";
    }
}