package com.project.dao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.entity.Auction;
import com.project.entity.Product;

import jakarta.persistence.LockModeType;

public interface AuctionDao extends JpaRepository<Auction, Long>{

	boolean existsByProduct(Product product);

	List<Auction> findByIsClosedFalseAndEndTimeAfter(LocalDateTime now);
	@Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Auction a WHERE a.auctionId = :id")
    Optional<Auction> findByIdWithLock(@Param("id") Long id);
}
