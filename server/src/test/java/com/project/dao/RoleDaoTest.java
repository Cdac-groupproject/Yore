package com.project.dao;

import com.project.entity.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class RoleDaoTest {

    @Autowired
    private RoleDao roleDao;

    private Role role;

    @BeforeEach
    void setup() {
        role = new Role();
        role.setRoleName("Admin");
        role = roleDao.save(role);
    }

    @Test
    void testSaveRole() {
        assertNotNull(role.getRoleId());
        assertEquals("Admin", role.getRoleName());
    }

    @Test
    void testFindById() {
        Optional<Role> found = roleDao.findById(role.getRoleId());
        assertTrue(found.isPresent());
        assertEquals("Admin", found.get().getRoleName());
    }

    @Test
    void testFindAll() {
        assertFalse(roleDao.findAll().isEmpty());
    }

    @Test
    void testDeleteById() {
        roleDao.deleteById(role.getRoleId());
        Optional<Role> deleted = roleDao.findById(role.getRoleId());
        assertFalse(deleted.isPresent());
    }
}
