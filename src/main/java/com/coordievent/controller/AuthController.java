package com.coordievent.controller;

import com.coordievent.dto.AuthRequest;
import com.coordievent.dto.AuthResponse;
import com.coordievent.dto.RegisterRequest;
import com.coordievent.model.Role;
import com.coordievent.model.User;
import com.coordievent.repository.UserRepository;
import com.coordievent.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
                
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        
        String jwt = jwtUtil.generateToken(userDetails, user.getRole().name());

        String statusStr = user.getProviderStatus() != null ? user.getProviderStatus().name() : null;
        return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getPhoneNumber(), statusStr));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setName(signUpRequest.getName());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword()));

        String requestedRole = signUpRequest.getRole() != null ? signUpRequest.getRole().toUpperCase() : "CUSTOMER";
        
        if ("PROVIDER".equals(requestedRole)) {
            if (signUpRequest.getPhoneNumber() == null || signUpRequest.getPhoneNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: Phone number is mandatory for service providers!"));
            }
            user.setRole(Role.PROVIDER);
            user.setPhoneNumber(signUpRequest.getPhoneNumber());
            user.setProviderStatus(com.coordievent.model.ProviderStatus.PENDING);
            user.setPortfolioUrl(signUpRequest.getPortfolioUrl());
        } else if ("ADMIN".equals(requestedRole)) {
            // In a real app, prevent public admin creation, but for project sake, allow seeding or restrict
            user.setRole(Role.ADMIN);
            user.setPhoneNumber(signUpRequest.getPhoneNumber());
        } else {
            user.setRole(Role.CUSTOMER);
            user.setPhoneNumber(signUpRequest.getPhoneNumber());
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }
}
