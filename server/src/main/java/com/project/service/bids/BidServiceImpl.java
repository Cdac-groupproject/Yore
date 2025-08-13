package com.project.service.bids;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.dao.AuctionDao;
import com.project.dao.BidDao;
import com.project.dao.UserDao;
import com.project.dto.bids.BidReqDTO;
import com.project.dto.bids.BidRespDTO;
import com.project.dto.events.BidEvent;
import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
@Service
@Transactional
@AllArgsConstructor
public class BidServiceImpl implements BidService{
	

    private BidDao bidDao;

   
    private AuctionDao auctionDao;


    private UserDao userDao;

    private ModelMapper modelMapper;
    private final SimpMessagingTemplate messagingTemplate;
	@Override
	@Transactional
	public BidRespDTO placeBid(BidReqDTO dto) {
	    // Lock auction row
	    Auction auction = auctionDao.findByIdWithLock(dto.getAuctionId())
	            .orElseThrow(() -> new ApiException("Invalid Auction ID"));

	    if (Boolean.TRUE.equals(auction.getIsClosed())) {
	        throw new ApiException("Auction is already closed.");
	    }

	    // Validate bidder
	    User bidder = userDao.findById(dto.getUserId())
	            .orElseThrow(() -> new ApiException("Invalid User ID"));

	    // Base price enforcement
	    Double newBidAmount = dto.getBidAmount();
	    if (newBidAmount.compareTo(auction.getBasePrice()) < 0) {
	        throw new ApiException("Bid must be at least equal to the base price ₹" + auction.getBasePrice());
	    }

	    // Check last bid by same user for this auction (prevent same-amount repeat)
	    Optional<Bid> lastUserBidOpt = bidDao.findTopByAuction_AuctionIdAndBidder_UserIdOrderByCreatedAtDesc(
	            auction.getAuctionId(),
	            bidder.getUserId()
	    );

	    if (lastUserBidOpt.isPresent()) {
	        Bid lastUserBid = lastUserBidOpt.get();
	        if (Double.compare(lastUserBid.getBidAmount(), newBidAmount) == 0) {
	            throw new ApiException("You cannot place the same bid amount twice in a row.");
	        }
	    }

	    // Fetch and lock current highest bid (if exists)
	    Optional<Bid> currentHighestOpt = bidDao.findFirstByAuction_AuctionIdOrderByBidAmountDesc(auction.getAuctionId());

	    if (currentHighestOpt.isPresent()) {
	        Bid highest = currentHighestOpt.get();

	        // If highest is by another user and newBid <= highest, reject
	        boolean highestBySameUser = highest.getBidder() != null &&
	                Objects.equals(highest.getBidder().getUserId(), dto.getUserId());

	        if (!highestBySameUser && newBidAmount.compareTo(highest.getBidAmount()) <= 0) {
	            throw new ApiException("Bid must be higher than current highest bid ₹" + highest.getBidAmount());
	        }

	        // If highestBySameUser but new amount is lower or equal, reject
	        if (highestBySameUser && newBidAmount.compareTo(highest.getBidAmount()) <= 0) {
	            throw new ApiException("You must bid higher than your previous highest bid.");
	        }
	    }

	    // Create and save new Bid row
	    Bid bid = modelMapper.map(dto, Bid.class);
	    bid.setAuction(auction);
	    bid.setBidder(bidder);
	    bid.setCreatedAt(LocalDateTime.now());

	    Bid saved = bidDao.saveAndFlush(bid);

	    // Build response
	    BidRespDTO respDTO = modelMapper.map(saved, BidRespDTO.class);
	    respDTO.setAuctionId(auction.getAuctionId());
	    respDTO.setUserId(bidder.getUserId());
	    respDTO.setUsername(bidder.getFullName());
	    
	    //broadcast bid event to subscribers
	    BidEvent bidEvent = new BidEvent();
	    bidEvent.setAuctionId(auction.getAuctionId());
	    bidEvent.setBidId(saved.getBidId());
	    bidEvent.setUserId(bidder.getUserId());
	    bidEvent.setUsername(bidder.getFullName());
	    bidEvent.setBidAmount(saved.getBidAmount());
	    bidEvent.setCreatedAt(saved.getCreatedAt());

	    messagingTemplate.convertAndSend("/topic/auction/" + auction.getAuctionId() + "/bids", bidEvent);
	    messagingTemplate.convertAndSend("/topic/auction/bids", bidEvent);

	    return respDTO;
	}

//	@Override
//	public BidRespDTO placeBid(BidReqDTO dto) {
//	    Auction auction = auctionDao.findById(dto.getAuctionId())
//	            .orElseThrow(() -> new ApiException("Invalid Auction ID"));
//
//	    if (Boolean.TRUE.equals(auction.getIsClosed())) {
//	        throw new ApiException("Auction is already closed.");
//	    }
//
//	    User bidder = userDao.findById(dto.getUserId())
//	            .orElseThrow(() -> new ApiException("Invalid User ID"));
//
//	    // 🔴 NEW: Enforce base price rule
//	    if (dto.getBidAmount().compareTo(auction.getBasePrice()) < 0) {
//	        throw new ApiException("Bid must be at least equal to the base price ₹" + auction.getBasePrice());
//	    }
//	    System.out.println("Placed Bid Called");
//	    Optional<Bid> currentHighest = bidDao.findHighestBidByAuctionId(dto.getAuctionId());
//
//	    if (currentHighest.isPresent() && dto.getBidAmount().compareTo(currentHighest.get().getBidAmount()) <= 0) {
//	        throw new ApiException("Bid must be higher than current highest bid ₹" + currentHighest.get().getBidAmount());
//	    }
//
//	    // Map DTO to Bid Entity using ModelMapper
//	    Bid bid = modelMapper.map(dto, Bid.class);
//	    bid.setAuction(auction);
//	    bid.setBidder(bidder);
//
//	    Bid saved = bidDao.save(bid);
//
//	    // Map Entity to Response DTO using ModelMapper
//	    BidRespDTO respDTO = modelMapper.map(saved, BidRespDTO.class);
//	    respDTO.setAuctionId(auction.getAuctionId());
//	    respDTO.setUserId(bidder.getUserId());
//	    respDTO.setUsername(bidder.getFullName());
//
//	    return respDTO;
//	}
	@Override
	public BidRespDTO getHighestBid(Long auctionId) {
	    // load auction (throws if invalid id)
	    Auction auction = auctionDao.findById(auctionId)
	            .orElseThrow(() -> new ApiException("Invalid Auction ID"));

	    // try to get highest bid
	    Optional<Bid> optBid = bidDao.findHighestBidByAuctionId(auctionId);

	    if (optBid.isPresent()) {
	        Bid bid = optBid.get();
	        BidRespDTO respDTO = modelMapper.map(bid, BidRespDTO.class);
	        respDTO.setAuctionId(bid.getAuction().getAuctionId());
	        respDTO.setUserId(bid.getBidder().getUserId());
	        respDTO.setUsername(bid.getBidder().getFullName());
	        return respDTO;
	    }

	    // No bids — return base/initial price from auction
	    BidRespDTO respDTO = new BidRespDTO();

	    // set auction id
	    respDTO.setAuctionId(auction.getAuctionId());

	    // set bid amount to auction's initial/base price
	    // --- adjust method name if your Auction entity uses a different getter
	    respDTO.setBidAmount(auction.getBasePrice());

	    // no bidder yet
	    respDTO.setUserId(null);
	    respDTO.setUsername(null);

	    return respDTO;
	}

}
