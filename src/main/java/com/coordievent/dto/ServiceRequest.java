package com.coordievent.dto;

import com.coordievent.model.BookingType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {
    private Long categoryId;
    private String title;
    private String description;
    private String location;
    private BigDecimal price;
    private BookingType bookingType;
    private String imageUrl;
}
