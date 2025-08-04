package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/bids")
public class BidController {
	@Autowired
    private BidService bidService;

    @PostMapping("/place")
    public ResponseEntity<BidRespDTO> placeBid(@RequestBody BidReqDTO dto) {
        return ResponseEntity.ok(bidService.placeBid(dto));
    }

    @GetMapping("/highest/{auctionId}")
    public ResponseEntity<BidRespDTO> getHighestBid(@PathVariable Long auctionId) {
        return ResponseEntity.ok(bidService.getHighestBid(auctionId));
    }
}
