package com.project.dao.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Product;

public interface ProductDao extends JpaRepository<Product, Long>{

	List<Product> findByAuctionedForTodayTrue();

	//Optional<Product> findById(Long productId);
	
}
