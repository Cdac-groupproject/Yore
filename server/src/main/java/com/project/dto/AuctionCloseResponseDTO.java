package com.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuctionCloseResponseDTO {
    private String winnerName;
    private Double winningBidAmount;
    private String message;

}