package com.coordievent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
    private String phoneNumber;
    private String providerStatus;
    
    public AuthResponse(String token, Long id, String username, String email, String role, String phoneNumber, String providerStatus) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.providerStatus = providerStatus;
    }
}
