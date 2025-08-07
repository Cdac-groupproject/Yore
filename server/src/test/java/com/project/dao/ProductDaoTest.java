package com.project.dao;

import com.project.dao.product.CountryRefDao;
import com.project.dao.product.ProductCategoryDao;
import com.project.dao.product.ProductDao;
import com.project.entity.CountryRef;
import com.project.entity.Product;
import com.project.entity.ProductCategory;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProductDaoTest {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private ProductCategoryDao productCategoryDao;

    @Autowired
    private CountryRefDao countryRefDao;

    private Product product;

    @BeforeEach
    void setup() {
        // Save ProductCategory
        ProductCategory category = new ProductCategory();
        category.setName("Vintage");
        category = productCategoryDao.save(category);

        // Save CountryRef
        CountryRef country = new CountryRef();
        country.setCountryName("India");
        country = countryRefDao.save(country);

        // Create and save Product
        product = new Product();
        product.setName("Vintage Bike");
        product.setDescription("A rare vintage bike");
        product.setPrice(15000.0);
        product.setSold(false);
        product.setAuctionedForToday(false);
        product.setYearMade(1970L);
        product.setCategory(category);
        product.setCountryOfOrigin(country);

        product = productDao.save(product);
    }

    @Test
    void testSaveProduct() {
        assertNotNull(product.getProductId());
        assertEquals("Vintage Bike", product.getName());
    }

    @Test
    void testFindById() {
        Optional<Product> found = productDao.findById(product.getProductId());
        assertTrue(found.isPresent());
        assertEquals(product.getName(), found.get().getName());
    }

    @Test
    void testFindAll() {
        assertFalse(productDao.findAll().isEmpty());
    }

    @Test
    void testDeleteById() {
        productDao.deleteById(product.getProductId());
        Optional<Product> deleted = productDao.findById(product.getProductId());
        assertFalse(deleted.isPresent());
    }
}
