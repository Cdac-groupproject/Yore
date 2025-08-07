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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class BidDaoTest {

    @Autowired
    private BidDao bidDao;

    @Autowired
    private AuctionDao auctionDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private GenderDao genderDao;

    @Autowired
    private RoleDao roleDao;

    private Auction auction;
    private User user;
    private Product product;

    @BeforeEach
    void setup() {
        // Setup product
        product = new Product();
        product.setName("Test Product");
        product.setSold(false);
        product = productDao.save(product);

        // Setup gender and role
        Gender gender = new Gender();
        gender.setGenderName("Male");
        gender = genderDao.save(gender);

        Role role = new Role();
        role.setRoleName("Bidder");
        role = roleDao.save(role);

        // Setup user
        user = new User();
        user.setFullName("Alice Tester");
        user.setEmail("alice@example.com");
        user.setPhoneNo("9999999999");
        user.setPassword("pass123");
        user.setGender(gender);
        user.setRole(role);
        user = userDao.save(user);

        // Setup auction
        auction = new Auction();
        auction.setProduct(product);
        auction.setAuctioneer(user);
        auction.setStartTime(LocalDateTime.now().minusMinutes(10));
        auction.setEndTime(LocalDateTime.now().plusMinutes(10));
        auction.setDurationMinutes(20);
        auction.setIsClosed(false);
        auction.setBasePrice(500.0);
        auction = auctionDao.save(auction);

        // Save some bids
        Bid bid1 = new Bid(null, auction, user, 600.0, LocalDateTime.now());
        Bid bid2 = new Bid(null, auction, user, 700.0, LocalDateTime.now());
        bidDao.save(bid1);
        bidDao.save(bid2);
    }

    @Test
    void testFindHighestBidByAuctionId() {
        Optional<Bid> highestBid = bidDao.findHighestBidByAuctionId(auction.getAuctionId());
        assertTrue(highestBid.isPresent());
        assertEquals(700.0, highestBid.get().getBidAmount());
    }

    @Test
    void testFindByAuctionOrderByBidAmountDesc() {
        List<Bid> bids = bidDao.findByAuction_AuctionIdOrderByBidAmountDesc(auction.getAuctionId());
        assertEquals(2, bids.size());
        assertTrue(bids.get(0).getBidAmount() >= bids.get(1).getBidAmount());
    }

    @Test
    void testFindTopByAuctionOrderByBidAmountDesc() {
        Optional<Bid> topBid = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
        assertTrue(topBid.isPresent());
        assertEquals(700.0, topBid.get().getBidAmount());
    }

    @Test
    void testFindTopByAuctionAndBidderOrderByBidAmountDesc() {
        Optional<Bid> topBid = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, user);
        assertTrue(topBid.isPresent());
        assertEquals(700.0, topBid.get().getBidAmount());
    }
}
