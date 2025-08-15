package com.project.dao.orders;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.dto.bidder.BIdderOrderDTO;
import com.project.entity.Order;

public interface OrdersDao extends JpaRepository<Order, Long> {
	@Query(value = "SELECT p.name AS productName, p.description AS productDescription, " +
            "DATE(o.order_date) AS orderDate, o.final_price AS finalPrice " +
            "FROM orders o " +
            "JOIN products p ON o.product_id = p.product_id " +
            "WHERE o.bidder_id = :bidderId", nativeQuery = true)
	List<BIdderOrderDTO> findOrdersByBidderId(@Param("bidderId") Long bidderId);
}
