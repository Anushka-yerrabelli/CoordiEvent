package com.coordievent.repository;

import com.coordievent.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByServiceId(Long serviceId);
}
