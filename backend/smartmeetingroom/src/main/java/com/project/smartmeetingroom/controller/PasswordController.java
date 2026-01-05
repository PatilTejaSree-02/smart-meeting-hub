package com.project.smartmeetingroom.controller;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.entity.*;
import com.project.smartmeetingroom.repository.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final UserRepository userRepo;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder encoder;

    public PasswordController(
            UserRepository userRepo,
            PasswordResetTokenRepository tokenRepo,
            PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.encoder = encoder;
    }

    @PostMapping("/request-reset")
    public void requestReset(@RequestParam String email) {

        User user = userRepo.findByEmail(email).orElseThrow();

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusSeconds(3600));

        tokenRepo.save(token);
    }

    @PostMapping("/reset")
    public void resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {

        PasswordResetToken prt =
                tokenRepo.findByToken(token).orElseThrow();

        if (prt.getUsedAt() != null ||
            prt.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token invalid or expired");
        }

        User user = prt.getUser();
        user.setPasswordHash(encoder.encode(newPassword));
        userRepo.save(user);

        prt.setUsedAt(Instant.now());
        tokenRepo.save(prt);
    }
}
