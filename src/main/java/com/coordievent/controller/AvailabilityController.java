package com.coordievent.controller;

import com.coordievent.model.Availability;
import com.coordievent.model.Service;
import com.coordievent.repository.AvailabilityRepository;
import com.coordievent.repository.ServiceRepository;
import com.coordievent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityRepository availabilityRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public AvailabilityController(AvailabilityRepository availabilityRepository, ServiceRepository serviceRepository, UserRepository userRepository) {
        this.availabilityRepository = availabilityRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/service/{serviceId}")
    public List<Availability> getServiceAvailability(@PathVariable Long serviceId) {
        return availabilityRepository.findByServiceId(serviceId);
    }

    @PostMapping("/service/{serviceId}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> setAvailability(@PathVariable Long serviceId, @RequestBody Availability availabilityRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Long providerId = userRepository.findByUsername(username).orElseThrow().getId();
        
        Service service = serviceRepository.findById(serviceId).orElseThrow();
        if (!service.getProvider().getId().equals(providerId)) {
            return ResponseEntity.status(403).build();
        }

        availabilityRequest.setService(service);
        return ResponseEntity.ok(availabilityRepository.save(availabilityRequest));
    }
}
