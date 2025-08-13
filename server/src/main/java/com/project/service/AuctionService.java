package com.project.service;

import java.util.List;

import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionCloseResponseDTO;
import com.project.dto.AuctionRespDTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public interface AuctionService {

	ApiResponse addNewAuction(AddAuctionDTO dto);

	List<AuctionRespDTO> getAllAuctions();

	AuctionRespDTO getAuctionDetails(@Min(1) @Max(100) Long auctionId);
	
	AuctionCloseResponseDTO closeAuction(Long id);

	List<AuctionRespDTO> getActiveAuctions();

	ApiResponse deleteAuctionById(Long id);

	ApiResponse startAuction(Long id);

}
