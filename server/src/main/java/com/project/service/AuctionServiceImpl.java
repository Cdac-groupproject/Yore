package com.project.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.AuctionDao;
import com.project.dao.ProductDao;
import com.project.dao.UserDao;
import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionRespDTO;
import com.project.entity.Auction;
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
	private final ModelMapper modelMapper;

	@Override
	public ApiResponse addNewAuction(AddAuctionDTO dto) {
		Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new ApiException("Invalid Product ID"));

        User auctioneer = userDao.findById(dto.getAuctioneerId())
                .orElseThrow(() -> new ApiException("Invalid Auctioneer ID"));

        // Check product not already sold or in active auction
        if (Boolean.TRUE.equals(product.getSold())) {
            throw new ApiException("Product is already sold.");
        }

        if (auctionDao.existsByProduct(product)) {
            throw new ApiException("Auction already exists for this product.");
        }
		
		
		// Set start and end time
        LocalDateTime start = dto.getStartTime() != null ? dto.getStartTime() : LocalDateTime.now();
        LocalDateTime end;

        if (dto.getEndTime() != null) {
            end = dto.getEndTime();
        } else if (dto.getDurationMinutes() != null) {
            end = start.plusMinutes(dto.getDurationMinutes());
        } else {
            throw new ApiException("Either endTime or durationMinutes must be provided.");
        }
		
		
		
		//map dto -> entity
		Auction entity = modelMapper.map(dto, Auction.class);
		// unique name , set status : true (=> restaurant available)
		entity.setAuctioneer(auctioneer);
	    entity.setProduct(product);
	    entity.setStartTime(start);
	    entity.setEndTime(end);
	    entity.setWinner(null);
	    entity.setIsClosed(false);
	    entity.setCreatedAt(LocalDateTime.now());
	    entity.setUpdatedAt(LocalDateTime.now());
		
		// invoke dao's method - save :insert
		Auction persistentAuction = auctionDao.save(entity);
		return new ApiResponse
				("Added new Auction with ID=" + persistentAuction.getAuctionId());
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
		Auction entity = auctionDao.findById(auctionId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Restaurant ID !!!!!"));
		// => success , map entity -> dto
		return modelMapper.map(entity, AuctionRespDTO.class);
	}

	@Override
	public ApiResponse closeAuction(Long id) {
		Auction auction = auctionDao.findById(id)
                .orElseThrow(() -> new ApiException("Auction not found"));

        if (auction.getIsClosed()) {
            throw new ApiException("Auction already closed");
        }

        auction.setIsClosed(true);
        auction.setUpdatedAt(LocalDateTime.now());
        auctionDao.save(auction);

        return new ApiResponse("Auction closed successfully");
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
