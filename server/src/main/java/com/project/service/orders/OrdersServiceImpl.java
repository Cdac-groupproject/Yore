package com.project.service.orders;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.orders.OrdersDao;
import com.project.dto.bidder.BIdderOrderDTO;
import com.project.dto.orders.OrderDto;
import com.project.entity.Order;

import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Min;

@Service
@Transactional
public class OrdersServiceImpl implements OrdersService {
	
	private final OrdersDao orderDao ;
    private final ModelMapper modelMapper;
	
	public OrdersServiceImpl(OrdersDao orderDao,ModelMapper modelMapper) {
		this.orderDao = orderDao;
		this.modelMapper = modelMapper;
	}


	

	@Override
	public List<OrderDto> getAllOrders() {
		// TODO Auto-generated method stub
		List<Order> orders = orderDao.findAll();
		return orders.stream().map(order -> {
			OrderDto dto = modelMapper.map(order, OrderDto.class);
			if(order.getProduct() != null) {
				dto.setProductid(order.getProduct().getProductId());
				dto.setProductName(order.getProduct().getName());
			}
			if(order.getAuctioneer() != null) {
				dto.setAuctioneerName(order.getAuctioneer().getFullName());
			}
			if(order.getBidder() != null) {
				dto.setBidderName(order.getBidder().getFullName());
			}
			return dto;
		}).toList();
	}

	@Override
	public OrderDto getOrderByID(@Min(1) Long id) {
		// TODO Auto-generated method stub
		Order order = orderDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("No order with this id"));
		OrderDto dto = modelMapper.map(order, OrderDto.class);
		if(order.getProduct() != null) {
			dto.setProductid(order.getProduct().getProductId());
			dto.setProductName(order.getProduct().getName());
		}
		if(order.getAuctioneer() != null) {
			dto.setAuctioneerName(order.getAuctioneer().getFullName());
		}
		if(order.getBidder() != null) {
			dto.setBidderName(order.getBidder().getFullName());
		}
		return dto;
	}
	
	@Override
	public List<BIdderOrderDTO> getOrdersForBidder(Long bidderId) {
        return orderDao.findOrdersByBidderId(bidderId);
    }
	
}
