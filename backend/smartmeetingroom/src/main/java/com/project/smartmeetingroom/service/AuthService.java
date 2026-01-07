package com.project.smartmeetingroom.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.smartmeetingroom.dto.LoginRequest;
import com.project.smartmeetingroom.dto.LoginResponse;
import com.project.smartmeetingroom.entity.User;
import com.project.smartmeetingroom.repository.UserRepository;
import com.project.smartmeetingroom.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

    if (request.getEmail() == null || request.getPassword() == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Email or password missing"
        );
    }

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
            );

    if (user.getStatus() != User.Status.active) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User inactive");
    }

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPasswordHash())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String token = jwtUtil.generateToken(
            user.getId(),
            user.getEmail(),
            user.getRole(),
            user.getTenantId()
    );

    return new LoginResponse(token,
    user.getId(),
    user.getEmail(),
    user.getRole(),
    user.getTenantId());
    }   

}
