package com.project.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuctionRespDTO {
	private Long auctionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isClosed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Product Info
    private Long productId;
    private String productName;
    private String description;
    private String countryOfOrigin;

    // Auctioneer Info
    private Long auctioneerId;
    private String auctioneerName;

    // Winner Info
    private Long winnerId;
    private String winnerName;
    private Double winningBidAmount;

    // Current State
    private Double basePrice;
    private Double currentHighestBid;
	
	
}
