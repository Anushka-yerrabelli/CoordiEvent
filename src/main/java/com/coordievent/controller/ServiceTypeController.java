package com.coordievent.controller;

import com.coordievent.model.Category;
import com.coordievent.model.ServiceType;
import com.coordievent.repository.CategoryRepository;
import com.coordievent.repository.ServiceTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/servicetypes")
public class ServiceTypeController {

    private final ServiceTypeRepository serviceTypeRepository;
    private final CategoryRepository categoryRepository;

    public ServiceTypeController(ServiceTypeRepository serviceTypeRepository, CategoryRepository categoryRepository) {
        this.serviceTypeRepository = serviceTypeRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<ServiceType> getAllServiceTypes() {
        return serviceTypeRepository.findAll();
    }

    @GetMapping("/category/{categoryId}")
    public List<ServiceType> getByCategory(@PathVariable Long categoryId) {
        return serviceTypeRepository.findByCategoryId(categoryId);
    }

    @PostMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceType> createServiceType(@PathVariable Long categoryId, @RequestBody ServiceType serviceType) {
        Category category = categoryRepository.findById(categoryId).orElseThrow();
        serviceType.setCategory(category);
        return ResponseEntity.ok(serviceTypeRepository.save(serviceType));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteServiceType(@PathVariable Long id) {
        serviceTypeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
