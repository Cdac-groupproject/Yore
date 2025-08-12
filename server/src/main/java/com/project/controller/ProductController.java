package com.project.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.ProductDTO;
import com.project.dto.product.ProductGetDto;
import com.project.dto.product.ProductPostDto;
import com.project.service.product.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class ProductController {

	@Autowired
    private final ProductService productService;

    /*
     * Request handling method (REST API end point)
     * - desc: Add new product
     * - URL: http://host:port/products/create
     * - Method: POST
     * - Payload: JSON representation of ProductDTO
     * - Response: SC 201 (CREATED) + created product DTO
     */
	@PostMapping("/manager/products/create")
    @Operation(description = "Add new product")
    public ResponseEntity<?> addNewProduct(@ModelAttribute ProductPostDto productPostDto) throws IOException{
    	return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(productPostDto));
    }

    /*
     * Request handling method (REST API end point)
     * - desc: List all products
     * - URL: http://host:port/products
     * - Method: GET
     * - Payload: none
     * - Response: SC 200 + List<ProductDTO> OR SC 204 if empty
     */
    @GetMapping("/manager/products")
    @Operation(description = "List All Products")
    public ResponseEntity<List<ProductGetDto>> getAllProducts() {
        List<ProductGetDto> products = productService.getAllProducts();
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }

    /*
     * REST API end point
     * - desc: Get product by ID
     * - URL: http://host:port/products/{id}
     * - Method: GET
     * - Payload: none
     * - Response: SC 200 + ProductDTO OR SC 404 if not found
     */
    @GetMapping("manager/products/{id}")
    @Operation(description = "Get Product by ID")
    public ResponseEntity<ProductGetDto> getProduct(@PathVariable @Min(1) Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /*
     * REST API end point
     * - desc: Update product by ID
     * - URL: http://host:port/products/{id}
     * - Method: PUT
     * - Payload: JSON representation of ProductDTO
     * - Response: SC 200 + Updated ProductDTO
     */
    @PutMapping(value="manager/products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "Update Product")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @ModelAttribute @Valid ProductPostDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    /*
     * REST API end point
     * - desc: Delete product by ID
     * - URL: http://host:port/products/{id}
     * - Method: DELETE
     * - Payload: none
     * - Response: SC 204 (NO_CONTENT)
     */
    @DeleteMapping("/manager/products/{id}")
    @Operation(description = "Delete Product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/manager/away-for-auction/{id}")
    @Operation(description = "make a product to go for auction")
    public ResponseEntity<String> markProductForAuction(@PathVariable("id") Long productId){
    	 productService.markProductAsAuctioned(productId);
         return ResponseEntity.ok("Product marked as auctioned for today.");
    }
    
    @GetMapping("/auctioneer/auction-products")
    @Operation(description = "list of all products ready for auction for today")
    public ResponseEntity<List<ProductGetDto>> getAllProductsMarkedForAuction(){
    	List<ProductGetDto> products = productService.getAllProductsMarkedForAuction();
        if(products == null) {
        	return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }
} 
