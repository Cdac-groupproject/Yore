package com.project.service.product;

import java.util.List;

import com.project.dto.ProductDTO;

public interface ProductService {

	ProductDTO addProduct(ProductDTO productDTO);
    ProductDTO getProductById(Long productId);
    List<ProductDTO> getAllProducts();
    ProductDTO updateProduct(Long productId, ProductDTO productDTO);
    void deleteProduct(Long productId);

}
