package com.project.smartmeetingroom.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.smartmeetingroom.service.EmailService;

@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/api/email/test")
    public String sendTestMail() {

        emailService.sendEmail(
                "tejasreepatil2115@gmail.com",
                "Smart Meeting Hub Test",
                "Email system working successfully!"
        );

        return "Test Mail Sent Successfully";
    }
}