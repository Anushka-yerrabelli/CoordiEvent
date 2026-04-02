package com.coordievent.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    private String phoneNumber;

    private String portfolioUrl;

    private String role; // expected CUSTOMER or PROVIDER (Admin created separately or seeded)
}
