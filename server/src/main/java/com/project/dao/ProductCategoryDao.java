package com.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.ProductCategory;

public interface ProductCategoryDao extends JpaRepository<ProductCategory, Long> {


}
