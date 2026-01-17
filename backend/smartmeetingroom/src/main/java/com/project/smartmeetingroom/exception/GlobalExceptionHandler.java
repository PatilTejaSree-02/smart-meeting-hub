package com.project.smartmeetingroom.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.smartmeetingroom.dto.ApiError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRuntime(RuntimeException ex) {

        // conflict booking case
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("already booked")) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiError(ex.getMessage()));
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiError(ex.getMessage()));
    }
}
