package com.project.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;

import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.orders.OrdersDao;
import com.project.dto.orders.OrderDto;
import com.project.entity.Order;
import com.project.entity.Product;
import com.project.entity.User;
import com.project.service.orders.OrdersServiceImpl;

public class OrdersServiceImplTest {

    private OrdersDao ordersDao;
    private ModelMapper modelMapper;
    private OrdersServiceImpl ordersService;

    @BeforeEach
    void setUp() {
        ordersDao = mock(OrdersDao.class);
        modelMapper = new ModelMapper();
        ordersService = new OrdersServiceImpl(ordersDao, modelMapper);
    }

    @Test
    void testGetAllOrders() {
        Order order1 = new Order();

        Product product1 = new Product();
        product1.setProductId(10L);
        product1.setName("Vintage Car");
        order1.setProduct(product1);

        User auctioneer = new User();
        auctioneer.setFullName("John Doe");
        order1.setAuctioneer(auctioneer);

        User bidder = new User();
        bidder.setFullName("Jane Smith");
        order1.setBidder(bidder);

        when(ordersDao.findAll()).thenReturn(Arrays.asList(order1));

        List<OrderDto> result = ordersService.getAllOrders();

        assertEquals(1, result.size());
        OrderDto dto = result.get(0);
        assertEquals(10L, dto.getProductid());
        assertEquals("Vintage Car", dto.getProductName());
        assertEquals("John Doe", dto.getAuctioneerName());
        assertEquals("Jane Smith", dto.getBidderName());
    }

    @Test
    void testGetOrderById_ExistingOrder() {
        Order order = new Order();

        Product product = new Product();
        product.setProductId(20L);
        product.setName("Classic Bike");
        order.setProduct(product);

        User auctioneer = new User();
        auctioneer.setFullName("Alice");
        order.setAuctioneer(auctioneer);

        User bidder = new User();
        bidder.setFullName("Bob");
        order.setBidder(bidder);

        when(ordersDao.findById(2L)).thenReturn(Optional.of(order));

        OrderDto dto = ordersService.getOrderByID(2L);

        assertNotNull(dto);
        assertEquals(20L, dto.getProductid());
        assertEquals("Classic Bike", dto.getProductName());
        assertEquals("Alice", dto.getAuctioneerName());
        assertEquals("Bob", dto.getBidderName());
    }

    @Test
    void testGetOrderById_OrderNotFound() {
        when(ordersDao.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            ordersService.getOrderByID(999L);
        });
    }
}
