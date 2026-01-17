package com.project.smartmeetingroom.dto;

public class ApiError {
    private String message;

    public ApiError(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
