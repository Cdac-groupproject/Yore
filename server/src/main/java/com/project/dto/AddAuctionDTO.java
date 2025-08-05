package com.project.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddAuctionDTO {
	
	private Long productId;
    private Long auctioneerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationMinutes;
    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be positive")
    private Double basePrice;
}
