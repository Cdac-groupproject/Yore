package com.project.dao.product;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.ProductCategory;

public interface ProductCategoryDao extends JpaRepository<ProductCategory, Long> {

	Optional<ProductCategory> findByCategoryId(Long categoryId);


}
