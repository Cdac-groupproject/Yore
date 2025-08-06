package com.project.dao;

import com.project.entity.Gender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class GenderDaoTest {

    @Autowired
    private GenderDao genderDao;

    private Gender gender;

    @BeforeEach
    void setup() {
        gender = new Gender();
        gender.setGenderName("Female");
        gender = genderDao.save(gender);
    }

    @Test
    void testSaveGender() {
        assertNotNull(gender.getGenderId());
        assertEquals("Female", gender.getGenderName());
    }

    @Test
    void testFindById() {
        Optional<Gender> found = genderDao.findById(gender.getGenderId());
        assertTrue(found.isPresent());
        assertEquals("Female", found.get().getGenderName());
    }

    @Test
    void testFindAll() {
        assertFalse(genderDao.findAll().isEmpty());
    }

    @Test
    void testDeleteById() {
        genderDao.deleteById(gender.getGenderId());
        Optional<Gender> deleted = genderDao.findById(gender.getGenderId());
        assertFalse(deleted.isPresent());
    }
}
