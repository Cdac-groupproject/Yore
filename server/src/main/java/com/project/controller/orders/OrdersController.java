package com.project.controller.orders;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.orders.OrderDto;
import com.project.dto.product.ProductGetDto;
import com.project.service.orders.OrdersService;
import com.project.service.product.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class OrdersController {

	private final OrdersService orderService;
	
	 	@GetMapping
	    @Operation(description = "List All Orders")
	    public ResponseEntity<List<OrderDto>> getAllOrders() {
	        List<OrderDto> orders = orderService.getAllOrders();
	        if (orders.isEmpty()) {
	            return ResponseEntity.noContent().build();
	        }
	        return ResponseEntity.ok(orders);
	    }
	 
	    @GetMapping("/{id}")
	    @Operation(description = "Get Product by ID")
	    public ResponseEntity<OrderDto> getOrderById(@PathVariable @Min(1) Long id) {
	        return ResponseEntity.ok(orderService.getOrderByID(id));
	    }
	
}
