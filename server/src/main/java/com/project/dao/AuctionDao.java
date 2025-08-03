package com.project.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Auction;
import com.project.entity.Product;

public interface AuctionDao extends JpaRepository<Auction, Long>{

	boolean existsByProduct(Product product);

	List<Auction> findByIsClosedFalseAndEndTimeAfter(LocalDateTime now);

}
