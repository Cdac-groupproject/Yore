package com.project.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
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
    private String productDescription;
    private String productOriginCountry;

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
