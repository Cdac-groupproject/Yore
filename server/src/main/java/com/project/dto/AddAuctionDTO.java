package com.project.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddAuctionDTO {
	
    private Long productId;           // ID of the product to auction
    private Long auctioneerId;        // ID of the user acting as auctioneer
    private LocalDateTime startTime;  // Optional: When auction starts
    private LocalDateTime endTime;    // Optional: When auction ends
    private Integer durationMinutes;  // Optional: If endTime is not provided, calculate using this
}
