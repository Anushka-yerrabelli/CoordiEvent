package com.coordievent.repository;

import com.coordievent.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookingServiceId(Long serviceId);
}
