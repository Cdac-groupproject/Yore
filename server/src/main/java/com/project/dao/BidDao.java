package com.project.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.Product;
import com.project.entity.User;

import jakarta.persistence.LockModeType;

public interface BidDao extends JpaRepository<Bid,Long>{
	@Query("SELECT b FROM Bid b WHERE b.auction.auctionId = :auctionId ORDER BY b.bidAmount DESC LIMIT 1")
	Optional<Bid> findHighestBidByAuctionId(@Param("auctionId") Long auctionId);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Bid> findFirstByAuction_AuctionIdOrderByBidAmountDesc(Long auctionId);
	
	
	Optional<Bid> findTopByAuction_AuctionIdAndBidder_UserIdOrderByCreatedAtDesc(Long auctionId, Long userId);

	List<Bid> findByAuction_AuctionIdOrderByBidAmountDesc(Long auctionId);

	//Bid findTopByAuctionOrderByBidAmountDesc(Auction auction);
	Optional<Bid> findTopByAuctionOrderByBidAmountDesc(Auction auction);

	Optional<Bid> findTopByAuctionAndBidderOrderByBidAmountDesc(Auction auction, User winner);
}
