package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.bids.BidReqDTO;
import com.project.dto.bids.BidRespDTO;
import com.project.service.bids.BidService;

@RestController
@RequestMapping("/bidder/bids")

public class BidController {
	@Autowired
    private BidService bidService;
	/*
	 * REST API end point - desc -Place Bid 
	 * URL
	 * -http://host:port/bids/place 
	 * Method - GET 
	 * Payload - none 
	 * successful Resp - SC 200 +Bid Resp dto-> JSON
	 * error resp - SC 404 + Apiresp (err mesg)
	 */
	@CrossOrigin(origins = "http://localhost:5173")
	@PostMapping("/place")
	public ResponseEntity<BidRespDTO> placeBid(@RequestBody BidReqDTO dto) {
	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

	    if (authentication == null || !authentication.isAuthenticated()) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }

	    // Principal is userId string from JwtUtil.validateToken()
	    String userIdStr = (String) authentication.getPrincipal();
	    Long userId = Long.valueOf(userIdStr);

	    dto.setUserId(userId);

	    return ResponseEntity.ok(bidService.placeBid(dto));
	}

    /*
	 * REST API end point - desc -get Highest Bid Amount by Auction id 
	 * URL
	 * -http://host:port/bids/highest/{auctionId} 
	 * Method - GET 
	 * Payload - none 
	 * successful Resp - SC 200 +Bid Resp dto-> JSON
	 * error resp - SC 404 + Apiresp (err mesg)
	 */
	@CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/highest/{auctionId}")
    public ResponseEntity<BidRespDTO> getHighestBid(@PathVariable Long auctionId) {
		
        return ResponseEntity.ok(bidService.getHighestBid(auctionId));
    }
}
