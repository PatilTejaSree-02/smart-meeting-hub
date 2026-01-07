package com.project.smartmeetingroom.dto;

public class UpdateUserRequest {

    private String role;
    private Boolean active;

    public UpdateUserRequest() {}

    public String getRole() { return role; }
    public Boolean getActive() { return active; }

    public void setRole(String role) { this.role = role; }
    public void setActive(Boolean active) { this.active = active; }
}
