package com.project.dto.bids;


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
    private Double bidAmount;
}
