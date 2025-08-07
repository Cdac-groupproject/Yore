package com.project.dao;

import com.project.dao.product.ProductDao;
import com.project.dao.product.ProductImageDao;
import com.project.entity.Product;
import com.project.entity.ProductImage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProductImageDaoTest {

    @Autowired
    private ProductImageDao productImageDao;

    @Autowired
    private ProductDao productDao;

    private ProductImage image;
    private Product product;

    @BeforeEach
    void setup() {
        // Create and save a product
        product = new Product();
        product.setName("Antique Vase");
        product.setSold(false);
        product = productDao.save(product);

        // Create and save a product image
        image = new ProductImage();
        image.setImgUrl("https://example.com/image.jpg");
        image.setProduct(product);
        image = productImageDao.save(image);
    }

    @Test
    void testSaveProductImage() {
        assertNotNull(image.getImageId());
        assertEquals("https://example.com/image.jpg", image.getImgUrl());
    }

    @Test
    void testFindById() {
        Optional<ProductImage> found = productImageDao.findById(image.getImageId());
        assertTrue(found.isPresent());
        assertEquals(image.getImgUrl(), found.get().getImgUrl());
    }

    @Test
    void testFindAll() {
        assertFalse(productImageDao.findAll().isEmpty());
    }

    @Test
    void testDeleteById() {
        productImageDao.deleteById(image.getImageId());
        Optional<ProductImage> deleted = productImageDao.findById(image.getImageId());
        assertFalse(deleted.isPresent());
    }
}
