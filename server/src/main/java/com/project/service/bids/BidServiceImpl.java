package com.project.service.bids;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.dao.AuctionDao;
import com.project.dao.BidDao;
import com.project.dao.UserDao;
import com.project.dto.bids.BidReqDTO;
import com.project.dto.bids.BidRespDTO;
import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.User;

import jakarta.transaction.Transactional;
@Service
@Transactional
public class BidServiceImpl implements BidService{
	
	@Autowired
    private BidDao bidDao;

    @Autowired
    private AuctionDao auctionDao;

    @Autowired
    private UserDao userDao;
	@Autowired
    private ModelMapper modelMapper;
    
	@Override
	public BidRespDTO placeBid(BidReqDTO dto) {
	    Auction auction = auctionDao.findById(dto.getAuctionId())
	            .orElseThrow(() -> new ApiException("Invalid Auction ID"));

	    if (Boolean.TRUE.equals(auction.getIsClosed())) {
	        throw new ApiException("Auction is already closed.");
	    }

	    User bidder = userDao.findById(dto.getUserId())
	            .orElseThrow(() -> new ApiException("Invalid User ID"));

	    // 🔴 NEW: Enforce base price rule
	    if (dto.getBidAmount().compareTo(auction.getBasePrice()) < 0) {
	        throw new ApiException("Bid must be at least equal to the base price ₹" + auction.getBasePrice());
	    }

	    Optional<Bid> currentHighest = bidDao.findHighestBidByAuctionId(dto.getAuctionId());

	    if (currentHighest.isPresent() && dto.getBidAmount().compareTo(currentHighest.get().getBidAmount()) <= 0) {
	        throw new ApiException("Bid must be higher than current highest bid ₹" + currentHighest.get().getBidAmount());
	    }

	    // Map DTO to Bid Entity using ModelMapper
	    Bid bid = modelMapper.map(dto, Bid.class);
	    bid.setAuction(auction);
	    bid.setBidder(bidder);

	    Bid saved = bidDao.save(bid);

	    // Map Entity to Response DTO using ModelMapper
	    BidRespDTO respDTO = modelMapper.map(saved, BidRespDTO.class);
	    respDTO.setAuctionId(auction.getAuctionId());
	    respDTO.setUserId(bidder.getUserId());
	    respDTO.setUsername(bidder.getFullName());

	    return respDTO;
	}
	@Override
	public BidRespDTO getHighestBid(Long auctionId) {
	    // Validate auction existence (optional but good practice)
	    if (!auctionDao.existsById(auctionId)) {
	        throw new ApiException("Invalid Auction ID");
	    }

	    Bid bid = bidDao.findHighestBidByAuctionId(auctionId)
	            .orElseThrow(() -> new ApiException("No bids found for this auction."));

	    BidRespDTO respDTO = modelMapper.map(bid, BidRespDTO.class);
	    respDTO.setAuctionId(bid.getAuction().getAuctionId());
	    respDTO.setUserId(bid.getBidder().getUserId());
	    respDTO.setUsername(bid.getBidder().getFullName());

	    return respDTO;
	}

}
