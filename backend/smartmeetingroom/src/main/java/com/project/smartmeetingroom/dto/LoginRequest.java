package com.project.smartmeetingroom.dto;

public class LoginRequest {

    private String email;
    private String password;
    private String tenant;   // subdomain like: "acme"

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getTenant() { return tenant; }

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setTenant(String tenant) { this.tenant = tenant; }
}
