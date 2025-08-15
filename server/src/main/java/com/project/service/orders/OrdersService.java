package com.project.service.orders;

import java.util.List;

import com.project.dto.bidder.BIdderOrderDTO;
import com.project.dto.orders.OrderDto;

import jakarta.validation.constraints.Min;

public interface OrdersService {
	List<OrderDto> getAllOrders();
	OrderDto getOrderByID(@Min(1) Long id);
	public List<BIdderOrderDTO> getOrdersForBidder(Long bidderId);
}
