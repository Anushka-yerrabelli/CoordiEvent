package com.coordievent.controller;

import com.coordievent.dto.ReviewRequest;
import com.coordievent.model.Booking;
import com.coordievent.model.BookingStatus;
import com.coordievent.model.Review;
import com.coordievent.model.User;
import com.coordievent.repository.BookingRepository;
import com.coordievent.repository.ReviewRepository;
import com.coordievent.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        User currentUser = getCurrentUser();
        Booking booking = bookingRepository.findById(request.getBookingId()).orElseThrow();

        if (!booking.getCustomer().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Not your booking"));
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Can only review confirmed/completed bookings"));
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/service/{serviceId}")
    public List<Review> getServiceReviews(@PathVariable Long serviceId) {
        return reviewRepository.findByBookingServiceId(serviceId);
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }
}
