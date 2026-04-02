package com.coordievent.controller;

import com.coordievent.dto.ServiceRequest;
import com.coordievent.model.Service;
import com.coordievent.model.User;
import com.coordievent.repository.CategoryRepository;
import com.coordievent.repository.ServiceRepository;
import com.coordievent.repository.ServiceTypeRepository;
import com.coordievent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final UserRepository userRepository;

    public ServiceController(ServiceRepository serviceRepository, CategoryRepository categoryRepository,
                             ServiceTypeRepository serviceTypeRepository, UserRepository userRepository) {
        this.serviceRepository = serviceRepository;
        this.categoryRepository = categoryRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Service> getAllServices(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String time) {
        
        return serviceRepository.findAll().stream()
                .filter(s -> categoryId == null || s.getCategory().getId().equals(categoryId))
                .filter(s -> location == null || location.isEmpty() || s.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(s -> keyword == null || keyword.isEmpty() || s.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                        (s.getDescription() != null && s.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .filter(s -> minPrice == null || s.getPrice().compareTo(minPrice) >= 0)
                .filter(s -> maxPrice == null || s.getPrice().compareTo(maxPrice) <= 0)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public List<Service> getMyServices() {
        User provider = getCurrentUser();
        return serviceRepository.findByProviderId(provider.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> createService(@RequestBody ServiceRequest request) {
        User provider = getCurrentUser();
        if (provider.getProviderStatus() != com.coordievent.model.ProviderStatus.APPROVED) {
            return ResponseEntity.status(403).body(java.util.Map.of("message", "Your provider account is currently " + provider.getProviderStatus() + ". You cannot create services until you are approved."));
        }
        
        Service service = new Service();
        service.setProvider(provider);
        service.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setLocation(request.getLocation());
        service.setPrice(request.getPrice());
        service.setBookingType(request.getBookingType());
        service.setImageUrl(request.getImageUrl());
        
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        Service service = serviceRepository.findById(id).orElseThrow();
        User provider = getCurrentUser();
        if(!service.getProvider().getId().equals(provider.getId())) {
             return ResponseEntity.status(403).build();
        }
        if (provider.getProviderStatus() != com.coordievent.model.ProviderStatus.APPROVED) {
            return ResponseEntity.status(403).body(java.util.Map.of("message", "Your provider account is currently " + provider.getProviderStatus() + ". You cannot update services until you are approved."));
        }
        
        service.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setLocation(request.getLocation());
        service.setPrice(request.getPrice());
        service.setBookingType(request.getBookingType());
        service.setImageUrl(request.getImageUrl());
        
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        Service service = serviceRepository.findById(id).orElseThrow();
        if(!service.getProvider().getId().equals(getCurrentUser().getId())) {
             return ResponseEntity.status(403).build();
        }
        
        // Block deletion if there are ACTIVE CONFIRMED bookings
        boolean hasConfirmed = service.getBookings() != null && service.getBookings().stream()
                .anyMatch(b -> b.getStatus() == com.coordievent.model.BookingStatus.CONFIRMED);
                
        if (hasConfirmed) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Cannot delete a service that has actively CONFIRMED customer bookings. Please cancel them first."));
        }

        serviceRepository.delete(service);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }
}
