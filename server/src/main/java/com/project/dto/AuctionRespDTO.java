package com.project.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class AuctionRespDTO {
	private Long auctionId;
    private ProductDTO product;
    private UserDTO auctioneer;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean isClosed;
    private UserDTO winner;
}
