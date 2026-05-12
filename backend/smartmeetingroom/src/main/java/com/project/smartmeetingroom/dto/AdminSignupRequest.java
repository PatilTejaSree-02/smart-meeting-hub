package com.project.smartmeetingroom.dto;

public class AdminSignupRequest {

    private String companyName;
    private String subdomain;

    private String firstName;
    private String lastName;

    private String email;
    private String password;

    private String department;

    /* ===== GETTERS ===== */

    public String getCompanyName() {
        return companyName;
    }

    public String getSubdomain() {
        return subdomain;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getDepartment() {
        return department;
    }

    /* ===== SETTERS ===== */

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}