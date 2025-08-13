package com.project.dto.events;

import java.time.LocalDateTime;

import com.project.entity.Auction;
import com.project.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidEvent {
    private Long auctionId;
    private Long bidId;
    private Long userId;
    private String username;
    private Double bidAmount;
    private Auction auction;
    private User bidder;
    private LocalDateTime createdAt;
}
