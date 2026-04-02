package com.coordievent.controller;

import com.coordievent.dto.BookingRequest;
import com.coordievent.model.Booking;
import com.coordievent.model.BookingStatus;
import com.coordievent.model.Service;
import com.coordievent.model.User;
import com.coordievent.repository.BookingRepository;
import com.coordievent.repository.ServiceRepository;
import com.coordievent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final com.coordievent.service.BookingService bookingService;

    public BookingController(BookingRepository bookingRepository, 
                             UserRepository userRepository,
                             com.coordievent.service.BookingService bookingService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        User customer = getCurrentUser();
        try {
            Booking booking = bookingService.createBooking(request, customer);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> getCustomerBookings() {
        return bookingRepository.findByCustomerId(getCurrentUser().getId());
    }

    @GetMapping("/provider")
    @PreAuthorize("hasRole('PROVIDER')")
    public List<Booking> getProviderBookings() {
        // Here we need to find bookings where the service's provider is the current user
        return bookingRepository.findAll().stream()
                .filter(b -> b.getService().getProvider().getId().equals(getCurrentUser().getId()))
                .toList();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('CUSTOMER')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        User currentUser = getCurrentUser();
        try {
            Booking updated = bookingService.updateBookingStatus(id, status, currentUser);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }
}
