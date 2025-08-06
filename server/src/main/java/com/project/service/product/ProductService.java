package com.project.service.product;

import java.io.IOException;
import java.util.List;

import com.project.dto.ProductDTO;
import com.project.dto.product.ProductPostDto;
import com.project.entity.Product;

public interface ProductService {

	Product addProduct(ProductPostDto productDTO) throws IOException;
    ProductDTO getProductById(Long productId);
    List<ProductDTO> getAllProducts();
    ProductDTO updateProduct(Long productId, ProductDTO productDTO);
    void deleteProduct(Long productId);

}
