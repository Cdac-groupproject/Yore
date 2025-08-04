package com.project.dto.bids;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidReqDTO {

	private Long auctionId;
    private Long userId;
    private BigDecimal bidAmount;
}
