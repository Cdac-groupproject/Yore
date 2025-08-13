package com.project.dto;

import java.time.LocalDateTime;

import com.project.validation.ValidAuctionTimes;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ValidAuctionTimes
public class AddAuctionDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Auctioneer ID is required")
    private Long auctioneerId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @Positive(message = "Duration must be positive")
    private Long durationMinutes; // Optional but must be > 0 if provided

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than zero")
    private Double basePrice;
}

