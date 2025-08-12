package com.project.service.product;

import java.io.IOException;
import java.util.List;

import com.project.dto.ProductDTO;
import com.project.dto.product.ProductGetDto;
import com.project.dto.product.ProductPostDto;
import com.project.entity.Product;

public interface ProductService {

	Product addProduct(ProductPostDto productDTO) throws IOException;
    ProductGetDto getProductById(Long productId);
    List<ProductGetDto> getAllProducts();
    ProductDTO updateProduct(Long productId, ProductPostDto productDTO);
    void deleteProduct(Long productId);
	void markProductAsAuctioned(Long productId);
	List<ProductGetDto> getAllProductsMarkedForAuction();
	
}
