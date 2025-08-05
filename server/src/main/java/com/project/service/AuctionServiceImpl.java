package com.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.AuctionDao;
import com.project.dao.BidDao;
import com.project.dao.ProductDao;
import com.project.dao.UserDao;
import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionRespDTO;
import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.Product;
import com.project.entity.User;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
@Service
@Transactional
@AllArgsConstructor
public class AuctionServiceImpl implements AuctionService{
	private final AuctionDao auctionDao;
	private final ProductDao productDao;
	private final UserDao userDao;
	private final BidDao bidDao;
	private final ModelMapper modelMapper;

	@Override
	public ApiResponse addNewAuction(AddAuctionDTO dto) {
	    Product product = productDao.findById(dto.getProductId())
	            .orElseThrow(() -> new ApiException("Invalid Product ID"));

	    User auctioneer = userDao.findById(dto.getAuctioneerId())
	            .orElseThrow(() -> new ApiException("Invalid Auctioneer ID"));

	    if (Boolean.TRUE.equals(product.getSold())) {
	        throw new ApiException("Product is already sold.");
	    }

	    if (auctionDao.existsByProduct(product)) {
	        throw new ApiException("Auction already exists for this product.");
	    }

	    LocalDateTime start = dto.getStartTime() != null ? dto.getStartTime() : LocalDateTime.now();
	    LocalDateTime end;

	    if (dto.getEndTime() != null) {
	        end = dto.getEndTime();
	    } else if (dto.getDurationMinutes() != null) {
	        end = start.plusMinutes(dto.getDurationMinutes());
	    } else {
	        throw new ApiException("Either endTime or durationMinutes must be provided.");
	    }

	    if (!end.isAfter(start)) {
	        throw new ApiException("End time must be after start time.");
	    }

	    // Set product flag
	    //product.setAuctionedForToday(true);
	    product.setUpdatedAt(LocalDateTime.now());
	    productDao.save(product);

	    Auction entity = modelMapper.map(dto, Auction.class);
	    entity.setAuctioneer(auctioneer);
	    entity.setProduct(product);
	    entity.setStartTime(start);
	    entity.setEndTime(end);
	    entity.setWinner(null);
	    entity.setBasePrice(dto.getBasePrice());
	    entity.setIsClosed(false);
	    entity.setCreatedAt(LocalDateTime.now());
	    entity.setUpdatedAt(LocalDateTime.now());

	    Auction persistentAuction = auctionDao.save(entity);

	    return new ApiResponse("Added new Auction with ID=" + persistentAuction.getAuctionId());
	}

	@Override
	public List<AuctionRespDTO> getAllAuctions() {
		// TODO Auto-generated method stub
		return auctionDao.findAll()
                .stream()
                .map(auction -> 
                modelMapper.map(auction, AuctionRespDTO.class))
                .toList();
	}

	@Override
	public AuctionRespDTO getAuctionDetails(@Min(1) @Max(100) Long auctionId) {
	    // 1. Fetch auction
	    Auction auction = auctionDao.findById(auctionId)
	            .orElseThrow(() -> new ResourceNotFoundException("Invalid Auction ID"));

	    // 2. Initialize response DTO
	    AuctionRespDTO dto = new AuctionRespDTO();
	    dto.setAuctionId(auction.getAuctionId());
	    dto.setStartTime(auction.getStartTime());
	    dto.setEndTime(auction.getEndTime());
	    dto.setBasePrice(auction.getBasePrice());
	    dto.setIsClosed(auction.getIsClosed());
	    dto.setCreatedAt(auction.getCreatedAt());
	    dto.setUpdatedAt(auction.getUpdatedAt());

	    // 3. Set product details
	    Product product = auction.getProduct();
	    dto.setProductId(product.getProductId());
	    dto.setProductName(product.getName());
	    dto.setProductDescription(product.getDescription()); // Optional
	    dto.setProductOriginCountry(product.getCountryOfOrigin().getCountryName()); // if available

	    // 4. Set auctioneer details
	    User auctioneer = auction.getAuctioneer();
	    dto.setAuctioneerId(auctioneer.getUserId());
	    dto.setAuctioneerName(auctioneer.getFullName());

	    // 5. Set winner info if closed
	 
	    if (auction.getWinner() != null) {
	        User winner = auction.getWinner();
	        dto.setWinnerId(winner.getUserId());
	        dto.setWinnerName(winner.getFullName());

	        Optional<Bid> winningBid = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
	        winningBid.ifPresent(bid -> dto.setWinningBidAmount(bid.getBidAmount()));
	    } else {
	        Optional<Bid> highestBid = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
	        dto.setCurrentHighestBid(highestBid.map(Bid::getBidAmount).orElse(auction.getBasePrice()));
	    }
	    

	    return dto;
	}

	
	@Override
	public ApiResponse closeAuction(Long id) {
	    Auction auction = auctionDao.findById(id)
	            .orElseThrow(() -> new ApiException("Auction not found"));

	    if (auction.getIsClosed()) {
	        throw new ApiException("Auction already closed");
	    }

	    // Optional-safe highest bid retrieval
	    Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);

	    if (highestBidOpt.isPresent()) {
	        Bid highestBid = highestBidOpt.get();
	        
	        // Set winner
	        User winner = highestBid.getBidder();
	        auction.setWinner(winner);

	        // Mark product as sold
	        Product product = auction.getProduct();
	        product.setSold(true);
	        productDao.save(product);
	    }

	    // Close the auction
	    auction.setIsClosed(true);
	    auction.setUpdatedAt(LocalDateTime.now());
	    auctionDao.save(auction);

	    // Construct detailed response
	    String message = highestBidOpt
	            .map(b -> String.format("Auction closed successfully.\nWinner: %s\nWinning Bid: ₹%.2f",
	                    b.getBidder().getFullName(), b.getBidAmount()))
	            .orElse("Auction closed successfully. No bids were placed.");

	    return new ApiResponse(message);
	}

	@Override
	public List<AuctionRespDTO> getActiveAuctions() {
		 LocalDateTime now = LocalDateTime.now();
	        return auctionDao.findByIsClosedFalseAndEndTimeAfter(now)
	                .stream()
	                .map(a -> modelMapper.map(a, AuctionRespDTO.class))
	                .toList();
	}

	@Override
	public ApiResponse deleteAuctionById(Long auctionId) {
		 Auction auction = auctionDao.findById(auctionId)
		            .orElseThrow(() -> new ApiException("Auction with ID " + auctionId + " not found"));

		    if (auction.getIsClosed() != null && !auction.getIsClosed()) {
		        throw new ApiException("Cannot delete an active auction. Please close it first.");
		    }

		    auctionDao.deleteById(auctionId);
		    return new ApiResponse("Auction with ID " + auctionId + " has been deleted successfully");
	}
	
	
	

}
