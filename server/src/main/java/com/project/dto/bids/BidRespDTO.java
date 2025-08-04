package com.project.dto.bids;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BidRespDTO {
	private Long bidId;
    private Long auctionId;
    private Long userId;
    private String username;
    private BigDecimal bidAmount;
    private LocalDateTime createdAt;
}
