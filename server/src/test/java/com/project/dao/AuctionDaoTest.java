package com.project.dao;

import com.project.dao.product.ProductDao;
import com.project.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AuctionDaoTest {

    @Autowired
    private AuctionDao auctionDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GenderDao genderDao;

    @Autowired
    private RoleDao roleDao;

    private Product product;
    private User auctioneer;
    private Auction auction;

    @BeforeEach
    void setup() {
        // Create and save Product
        product = new Product();
        product.setName("Vintage Car");
        product.setSold(false);
        product = productDao.save(product);

        // Create and save Gender and Role
        Gender gender = new Gender();
        gender.setGenderName("Male");
        gender = genderDao.save(gender);

        Role role = new Role();
        role.setRoleName("Auctioneer");
        role = roleDao.save(role);

        // Create and save User
        auctioneer = new User();
        auctioneer.setFullName("John Doe");
        auctioneer.setEmail("john@example.com");
        auctioneer.setPhoneNo("1234567890");
        auctioneer.setPassword("password");
        auctioneer.setGender(gender);
        auctioneer.setRole(role);
        auctioneer = userDao.save(auctioneer);

        // Create and save Auction
        auction = new Auction();
        auction.setProduct(product);
        auction.setAuctioneer(auctioneer);
        auction.setStartTime(LocalDateTime.now().minusMinutes(5));
        auction.setEndTime(LocalDateTime.now().plusMinutes(10));
        auction.setDurationMinutes(15);
        auction.setIsClosed(false);
        auction.setBasePrice(10000.0);
        auction = auctionDao.save(auction);
    }

    @Test
    void testExistsByProduct() {
        boolean exists = auctionDao.existsByProduct(product);
        assertTrue(exists);
    }

    @Test
    void testFindByIsClosedFalseAndEndTimeAfter() {
        List<Auction> activeAuctions = auctionDao.findByIsClosedFalseAndEndTimeAfter(LocalDateTime.now());
        assertFalse(activeAuctions.isEmpty());
        assertEquals(auction.getAuctionId(), activeAuctions.get(0).getAuctionId());
    }
}
