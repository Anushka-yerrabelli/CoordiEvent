package com.coordievent.service;

import com.coordievent.dto.BookingRequest;
import com.coordievent.model.Booking;
import com.coordievent.model.BookingStatus;
import com.coordievent.model.Service;
import com.coordievent.model.User;
import com.coordievent.repository.BookingRepository;
import com.coordievent.repository.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(BookingRepository bookingRepository, ServiceRepository serviceRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, User customer) {
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        // Overlap validation with precise times
        LocalDate end = request.getEndDate() != null ? request.getEndDate() : request.getStartDate();
        LocalTime startTime = request.getStartTime() != null ? request.getStartTime() : LocalTime.of(0, 0);
        LocalTime endTime   = request.getEndTime() != null ? request.getEndTime() : LocalTime.of(23, 59, 59);

        List<Booking> overlaps = bookingRepository.findOverlappingBookingsWithStatus(
                service.getId(), BookingStatus.CONFIRMED, request.getStartDate(), end, startTime, endTime);

        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Service is already booked and confirmed for these dates and times. Please choose another slot.");
        }

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setService(service);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(end); // Avoid saving null
        booking.setStartTime(startTime); // Avoid saving null
        booking.setEndTime(endTime); // Avoid saving null
        booking.setStatus(BookingStatus.PENDING);
        
        // Simple mock price calculation based on service type
        booking.setTotalPrice(service.getPrice()); // Ideally calculated based on days/hours

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus, User currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (currentUser.getRole().name().equals("CUSTOMER")) {
            if (newStatus != BookingStatus.CANCELLED) {
                throw new IllegalStateException("Customer can only cancel their bookings.");
            }
            if (!booking.getCustomer().getId().equals(currentUser.getId())) {
                throw new IllegalStateException("Customer can only cancel their own bookings.");
            }
            if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
                throw new IllegalStateException("Cannot cancel a booking that is already " + booking.getStatus());
            }
            booking.setStatus(newStatus);
            return bookingRepository.save(booking);
        }

        if (currentUser.getRole().name().equals("PROVIDER")) {
            if (!booking.getService().getProvider().getId().equals(currentUser.getId())) {
                throw new IllegalStateException("Provider can only manage their own services' bookings.");
            }
            
            if (newStatus != BookingStatus.CONFIRMED && newStatus != BookingStatus.REJECTED) {
                throw new IllegalStateException("Provider can only CONFIRM or REJECT bookings.");
            }
            
            if (booking.getStatus() != BookingStatus.PENDING) {
                throw new IllegalStateException("Can only transition from PENDING state.");
            }

            if (newStatus == BookingStatus.CONFIRMED) {
                LocalDate end = booking.getEndDate() != null ? booking.getEndDate() : booking.getStartDate();
                LocalTime startTime = booking.getStartTime() != null ? booking.getStartTime() : LocalTime.of(0, 0);
                LocalTime endTime   = booking.getEndTime() != null ? booking.getEndTime() : LocalTime.of(23, 59, 59);

                // Double check for race condition
                List<Booking> confirmOverlaps = bookingRepository.findOverlappingBookingsWithStatus(
                        booking.getService().getId(), BookingStatus.CONFIRMED, booking.getStartDate(), end, startTime, endTime);

                if (!confirmOverlaps.isEmpty()) {
                    throw new IllegalStateException("Slot was just booked and confirmed by someone else!");
                }

                booking.setStatus(BookingStatus.CONFIRMED);
                Booking savedBooking = bookingRepository.save(booking);

                // Auto-reject overlapping pending requests
                List<Booking> pendingOverlaps = bookingRepository.findOverlappingBookingsWithStatus(
                        booking.getService().getId(), BookingStatus.PENDING, booking.getStartDate(), end, startTime, endTime);

                for (Booking pending : pendingOverlaps) {
                    if (!pending.getId().equals(booking.getId())) {
                        pending.setStatus(BookingStatus.REJECTED);
                        bookingRepository.save(pending);
                    }
                }
                
                return savedBooking;
            } else {
                // Rejecting
                booking.setStatus(BookingStatus.REJECTED);
                return bookingRepository.save(booking);
            }
        }

        throw new IllegalStateException("Unauthorized role.");
    }
}
