package com.project.service;

import com.project.custom_exception.ApiException;
import com.project.dao.AuctionDao;
import com.project.dao.product.ProductDao;
import com.project.dao.UserDao;
import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.entity.Auction;
import com.project.entity.Product;
import com.project.entity.User;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuctionServiceTest {

    @Mock private AuctionDao auctionDao;
    @Mock private ProductDao productDao;
    @Mock private UserDao userDao;
    @Mock private ModelMapper modelMapper;

    @InjectMocks
    private AuctionServiceImpl auctionService;

    private AddAuctionDTO dto;
    private Product product;
    private User auctioneer;
    private Auction auction;

    @BeforeEach
    void setUp() {
        dto = new AddAuctionDTO();
        dto.setProductId(1L);
        dto.setAuctioneerId(2L);
        dto.setBasePrice(500.0);
        dto.setStartTime(LocalDateTime.now());
        dto.setEndTime(LocalDateTime.now().plusMinutes(10));

        product = new Product();
        product.setProductId(1L);
        product.setSold(false);

        auctioneer = new User();
        auctioneer.setUserId(2L);

        auction = new Auction();
        auction.setAuctionId(10L);
    }

    @Test
    void testAddNewAuction_Success() {
        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.of(auctioneer));
        when(auctionDao.existsByProduct(product)).thenReturn(false);
        when(modelMapper.map(dto, Auction.class)).thenReturn(auction);
        when(auctionDao.save(any(Auction.class))).thenReturn(auction);

        ApiResponse response = auctionService.addNewAuction(dto);

        assertNotNull(response);
        assertEquals("Added new Auction with ID=10", response.getMessage());
    }

    @Test
    void testAddNewAuction_ProductNotFound() {
        when(productDao.findById(1L)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("Invalid Product ID", ex.getMessage());
    }

    @Test
    void testAddNewAuction_InvalidAuctioneer() {
        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.empty());

        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("Invalid Auctioneer ID", ex.getMessage());
    }

    @Test
    void testAddNewAuction_ProductAlreadySold() {
        // Arrange
        product.setSold(true);
        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.of(auctioneer)); // Important: Must return valid auctioneer

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("Product is already sold.", ex.getMessage());
    }

    @Test
    void testAddNewAuction_AlreadyExists() {
        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.of(auctioneer));
        when(auctionDao.existsByProduct(product)).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("Auction already exists for this product.", ex.getMessage());
    }

    @Test
    void testAddNewAuction_EndTimeBeforeStartTime() {
        dto.setEndTime(LocalDateTime.now().minusMinutes(1)); // Invalid

        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.of(auctioneer));
        when(auctionDao.existsByProduct(product)).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("End time must be after start time.", ex.getMessage());
    }

    @Test
    void testAddNewAuction_NoEndTimeOrDuration() {
        dto.setEndTime(null);
        dto.setDurationMinutes(null);

        when(productDao.findById(1L)).thenReturn(Optional.of(product));
        when(userDao.findById(2L)).thenReturn(Optional.of(auctioneer));
        when(auctionDao.existsByProduct(product)).thenReturn(false);

        ApiException ex = assertThrows(ApiException.class, () -> {
            auctionService.addNewAuction(dto);
        });

        assertEquals("Either endTime or durationMinutes must be provided.", ex.getMessage());
    }
}
