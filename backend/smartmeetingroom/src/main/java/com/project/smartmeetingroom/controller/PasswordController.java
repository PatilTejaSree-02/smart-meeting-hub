package com.project.smartmeetingroom.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    @PostMapping("/forgot")
    public void forgot(@RequestParam String email) {
        // implement later
    }

    @PostMapping("/reset")
    public void reset(@RequestParam String token,
                      @RequestParam String password) {
        // implement later
    }
}
