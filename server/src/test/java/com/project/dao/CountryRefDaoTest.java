package com.project.dao;

import com.project.dao.product.CountryRefDao;
import com.project.entity.CountryRef;
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
public class CountryRefDaoTest {

    @Autowired
    private CountryRefDao countryRefDao;

    private CountryRef countryRef;

    @BeforeEach
    void setup() {
        countryRef = new CountryRef();
        countryRef.setCountryName("India");
        countryRef = countryRefDao.save(countryRef);
    }

    @Test
    void testSaveCountryRef() {
        assertNotNull(countryRef.getCountryId());
        assertEquals("India", countryRef.getCountryName());
    }

    @Test
    void testFindById() {
        Optional<CountryRef> found = countryRefDao.findById(countryRef.getCountryId());
        assertTrue(found.isPresent());
        assertEquals("India", found.get().getCountryName());
    }

    @Test
    void testFindAll() {
        List<CountryRef> allCountries = countryRefDao.findAll();
        assertFalse(allCountries.isEmpty());
    }

    @Test
    void testDeleteById() {
        countryRefDao.deleteById(countryRef.getCountryId());
        Optional<CountryRef> deleted = countryRefDao.findById(countryRef.getCountryId());
        assertFalse(deleted.isPresent());
    }
}
