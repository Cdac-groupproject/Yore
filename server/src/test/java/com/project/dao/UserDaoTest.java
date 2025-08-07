package com.project.dao;

import com.project.entity.Gender;
import com.project.entity.Role;
import com.project.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Autowired
    private GenderDao genderDao;

    @Autowired
    private RoleDao roleDao;

    private User user;

    @BeforeEach
    void setup() {
        // Save required Gender
        Gender gender = new Gender();
        gender.setGenderName("Male");
        gender = genderDao.save(gender);

        // Save required Role
        Role role = new Role();
        role.setRoleName("Bidder");
        role = roleDao.save(role);

        // Create and save User
        user = new User();
        user.setFullName("Alice Smith");
        user.setEmail("alice@example.com");
        user.setPhoneNo("9999999999");
        user.setPassword("password123");
        user.setAge(28);
        user.setGender(gender);
        user.setRole(role);
        user = userDao.save(user);
    }

    @Test
    void testSaveUser() {
        assertNotNull(user.getUserId());
        assertEquals("Alice Smith", user.getFullName());
        assertEquals("alice@example.com", user.getEmail());
    }

    @Test
    void testFindById() {
        Optional<User> found = userDao.findById(user.getUserId());
        assertTrue(found.isPresent());
        assertEquals("Alice Smith", found.get().getFullName());
    }

    @Test
    void testFindAll() {
        assertFalse(userDao.findAll().isEmpty());
    }

    @Test
    void testDeleteById() {
        userDao.deleteById(user.getUserId());
        Optional<User> deleted = userDao.findById(user.getUserId());
        assertFalse(deleted.isPresent());
    }
}
