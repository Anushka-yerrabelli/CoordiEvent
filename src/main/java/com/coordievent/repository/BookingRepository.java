package com.coordievent.repository;

import com.coordievent.model.Booking;
import com.coordievent.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDate;

import java.time.LocalTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByServiceId(Long serviceId);
    List<Booking> findByServiceProviderId(Long providerId);

    @Query("SELECT b FROM Booking b WHERE b.service.id = :serviceId AND b.status = :status AND " +
           "(b.startDate < :endDate OR (b.startDate = :endDate AND b.startTime < :endTime)) AND " +
           "(b.endDate > :startDate OR (b.endDate = :startDate AND b.endTime > :startTime))")
    List<Booking> findOverlappingBookingsWithStatus(@Param("serviceId") Long serviceId, 
                                          @Param("status") BookingStatus status,
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endTime") LocalTime endTime);
}
