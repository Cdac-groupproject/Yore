package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.product.ProductCategoryDto;
import com.project.entity.ProductCategory;
import com.project.service.product.ProductService;
import com.project.service.product.required.ProductCategoryService;

import io.swagger.v3.oas.annotations.Operation;
import jdk.jfr.Description;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class ProductCategoryController {
	private final ProductCategoryService productCategoryService;
	
	@GetMapping("/getAllCategories")
	@Operation(description = "get all categories")
	ResponseEntity<List<ProductCategoryDto>> getAllCategories(){
		List<ProductCategoryDto> allCategories = productCategoryService.getAllProductCategory();
		if(allCategories.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(allCategories);
	}
	
	@PostMapping("/manager/addCategory")
	@Operation(description = "add a product category")
	ResponseEntity<ProductCategory> addProduct(@RequestBody ProductCategoryDto productCategoryDto){
		return ResponseEntity.status(HttpStatus.CREATED).body(productCategoryService.productCategoryCreate(productCategoryDto));
	}
}
