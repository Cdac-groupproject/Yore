package com.project.service.product.required;

import java.util.List;

import com.project.dto.product.ProductCategoryDto;
import com.project.entity.ProductCategory;

public interface ProductCategoryService {
	ProductCategory productCategoryCreate(ProductCategoryDto productCategoryDto);
	List<ProductCategoryDto> getAllProductCategory();
}
