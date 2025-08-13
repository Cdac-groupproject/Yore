package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionCloseResponseDTO;
import com.project.dto.AuctionRespDTO;
import com.project.service.AuctionService;
import com.project.service.AuctionServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;

@RestController 
@RequestMapping("/auctioneer/auctions")
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class AuctionController {
	private final AuctionService auctionService;
	
	
	/*
	 * Request handling method (REST API end point) 
	 * - desc - Add new Auction 
	 * URL -http://host:port/auctioneer/auctions/create 
	 * Method - POST 
	 * Payload -JSON representation of auction 
	 * Resp - in case failure (dup product name/id) - ApiResp DTO
	 *  - containing err mesg + SC 400(BAD_REQUEST)
	 *  success - SC 201 + ApiResp - success mesg
	 */
	@PostMapping("/create")
	@Operation(description = "Add New Auction")
	public ResponseEntity<?> addNewAuction(@RequestBody @Valid AddAuctionDTO dto) {
		System.out.println("in add " + dto);
		
		// call service method
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(auctionService
						.addNewAuction(dto));

	}
	
	/*
	 * Request handling method (REST API end point) URL -
	 * http://host:port/auctioneer/auctions/ 
	 * Method - GET 
	 * Payload - none 
	 * Resp - in case of empty list - SC204 (NO_CONTENT) 
	 * o.w SC 200 + list of auctions -> JSON []
	 */
	@GetMapping
	public  ResponseEntity<?> listAvailableAuctions() {
		System.out.println("in list");
		List<AuctionRespDTO> auctions 
		= auctionService.getAllAuctions();
		if(auctions.isEmpty())
			 return ResponseEntity
					 .status(HttpStatus.NO_CONTENT).build();
		//=> list non empty		
		return ResponseEntity.ok(auctions);
	}
	
	/*
	 * REST API end point - desc -get auction details by id 
	 * URL
	 * -http://host:port/auctioneer/auctions/{auctionId} 
	 * Method - GET 
	 * Payload - none 
	 * successful Resp - SC 200 +Auction Resp dto-> JSON
	 * error resp - SC 404 + Apiresp (err mesg)
	 */
	@GetMapping("/{auctionId}")
	// swagger annotation
	@Operation(description = "Get Auction details by ID")
	public ResponseEntity<?> getAuctionDetailsByID(
			@PathVariable @Min(1) @Max(100) Long auctionId) {
		System.out.println("in get details " + auctionId);
	
		return ResponseEntity.ok(
				auctionService.getAuctionDetails(auctionId));

	}
	
	/*
	 * REST API end point - desc -close auction by id 
	 * URL
	 * -http://host:port/auctioneer/auctions/close/{auctionId} 
	 * Method - PUT 
	 * Payload - none 
	 * successful Resp - SC 200 +Apiresp Succesfully Closed message
	 * error resp - SC 404 + Apiresp (err mesg)
	 */
	@PutMapping("/close/{id}")
	public ResponseEntity<?> closeAuction(@PathVariable Long id) {
	    AuctionCloseResponseDTO response = auctionService.closeAuction(id);
	    return ResponseEntity.ok(response);
	}
	
	
	/*
	 * Request handling method (REST API end point) URL -
	 * http://host:port/auctioneer/auctions/active 
	 * Method - GET 
	 * Payload - none 
	 * Resp - in case of empty list - SC204 (NO_CONTENT) 
	 * o.w SC 200 + list of auctions -> JSON []
	 */
	@GetMapping("/active")
    public List<AuctionRespDTO> getActiveAuctions() {
        return auctionService.getActiveAuctions();
    }
	
	/*
	 * REST API end point - 
	 * desc -soft delete auction details 
	 * URL-http://host:port/auctioneer/auctions/{auctionId} 
	 * Method - DELETE 
	 * Payload - none
	 * Resp - ApiResponse
	 */
	@DeleteMapping("/{auctionId}")
	public ApiResponse deleteAuction(@PathVariable Long auctionId) {
	    return auctionService.deleteAuctionById(auctionId);
	}
	
	@PutMapping("/start/{id}")
	public ResponseEntity<?> startAuction(@PathVariable Long id) {
	    // we can add a simple service method to mark auction startTime = now (if not started) or just notify
	    auctionService.startAuction(id);
	    return ResponseEntity.ok(new ApiResponse("Auction started and event broadcasted"));
	}

}
