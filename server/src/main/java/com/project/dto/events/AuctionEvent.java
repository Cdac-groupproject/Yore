package com.project.dto.events;

import java.time.LocalDateTime;

import com.project.dto.ProductDTO;
import com.project.entity.Product;
import com.project.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionEvent {
    private String type; // "START" or "STOP" (or others later)
    private Long auctionId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double basePrice;
    private Double currentHighestBid; // optional
    //private ProductDTO product;
    private User auctioneer;
   
    // add more fields as you need (productId, winner info, message...)
}
