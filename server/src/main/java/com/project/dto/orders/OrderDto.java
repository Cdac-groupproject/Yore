package com.project.dto.orders;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.project.entity.Product;
import com.project.entity.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderDto {
	private Long orderId;
    private Long productid;
    private String productName;
    private String bidderName;
    private String auctioneerName;
    private LocalDateTime orderDate;
    private BigDecimal finalPrice;
}
