package com.project.dao.product;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.ProductImage;

public interface ProductImageDao extends JpaRepository<ProductImage, Integer> {
	
}
