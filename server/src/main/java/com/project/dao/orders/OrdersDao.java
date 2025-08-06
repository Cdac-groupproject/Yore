package com.project.dao.orders;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Order;

public interface OrdersDao extends JpaRepository<Order, Long> {

}
