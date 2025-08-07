package com.project.dao;

import com.project.dao.product.ProductCategoryDao;
import com.project.entity.ProductCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ProductCategoryDaoTest {

    @Autowired
    private ProductCategoryDao productCategoryDao;

    private ProductCategory category;

    @BeforeEach
    void setup() {
        category = new ProductCategory();
        category.setName("Collectibles");
        category = productCategoryDao.save(category);
    }

    @Test
    void testSaveCategory() {
        assertNotNull(category.getCategoryId());
        assertEquals("Collectibles", category.getName());
    }

    @Test
    void testFindById() {
        Optional<ProductCategory> found = productCategoryDao.findById(category.getCategoryId());
        assertTrue(found.isPresent());
        assertEquals("Collectibles", found.get().getName());
    }

    @Test
    void testFindAll() {
        List<ProductCategory> categories = productCategoryDao.findAll();
        assertFalse(categories.isEmpty());
    }

    @Test
    void testDeleteCategory() {
        productCategoryDao.deleteById(category.getCategoryId());
        Optional<ProductCategory> deleted = productCategoryDao.findById(category.getCategoryId());
        assertFalse(deleted.isPresent());
    }
}
