package com.project.service.bids;

import com.project.dto.bids.BidReqDTO;
import com.project.dto.bids.BidRespDTO;

public interface BidService {

	BidRespDTO  placeBid(BidReqDTO dto);

	BidRespDTO  getHighestBid(Long auctionId);

}
