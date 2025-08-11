package com.project.service.product.required;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.dao.product.ProductCategoryDao;
import com.project.dto.product.ProductCategoryDto;
import com.project.entity.ProductCategory;

import jakarta.transaction.Transactional;


@Service
@Transactional
public class ProductCategoryServiceImpl implements ProductCategoryService {

	public final ProductCategoryDao productCategoryDao;
	public final ModelMapper modelMapper;
	
	
	
	public ProductCategoryServiceImpl(ProductCategoryDao productCategoryDao, ModelMapper modelMapper) {
		super();
		this.productCategoryDao = productCategoryDao;
		this.modelMapper = modelMapper;
	}

	@Override
	public ProductCategory productCategoryCreate(ProductCategoryDto productCategoryDto) {
		// TODO Auto-generated method stub
		ProductCategory productCategory = modelMapper.map(productCategoryDto, ProductCategory.class);
		productCategoryDao.save(productCategory);
		return productCategory;
	}

	@Override
	public List<ProductCategoryDto> getAllProductCategory() {
		// TODO Auto-generated method stub
		List<ProductCategory> allProductCategories = productCategoryDao.findAll();
		return allProductCategories.stream().map(category -> {
			ProductCategoryDto productCategoryDto = modelMapper.map(category, ProductCategoryDto.class);
			return productCategoryDto;
		}).toList();
	}

}
