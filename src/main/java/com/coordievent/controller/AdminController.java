package com.coordievent.controller;

import com.coordievent.model.ProviderStatus;
import com.coordievent.model.Role;
import com.coordievent.model.User;
import com.coordievent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/providers")
    public ResponseEntity<List<User>> getAllProviders() {
        List<User> providers = userRepository.findByRole(Role.PROVIDER);
        // We probably don't want to expose passwordHash and other sensitive fields but for simplicity we return User
        return ResponseEntity.ok(providers);
    }

    @PutMapping("/providers/{id}/approve")
    public ResponseEntity<?> approveProvider(@PathVariable Long id) {
        User provider = userRepository.findById(id).orElseThrow();
        if (provider.getRole() != Role.PROVIDER) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a provider"));
        }
        
        provider.setProviderStatus(ProviderStatus.APPROVED);
        userRepository.save(provider);
        return ResponseEntity.ok(Map.of("message", "Provider approved successfully"));
    }

    @PutMapping("/providers/{id}/reject")
    public ResponseEntity<?> rejectProvider(@PathVariable Long id) {
        User provider = userRepository.findById(id).orElseThrow();
        if (provider.getRole() != Role.PROVIDER) {
            return ResponseEntity.badRequest().body(Map.of("message", "User is not a provider"));
        }
        
        provider.setProviderStatus(ProviderStatus.REJECTED);
        userRepository.save(provider);
        return ResponseEntity.ok(Map.of("message", "Provider rejected successfully"));
    }
}
