package com.project.service.bidder;

import java.util.List;

import com.project.dto.ApiResponseDTO;
import com.project.dto.EditProfileDTO;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.dto.bidder.BidderLogReqDTO;
import com.project.dto.bidder.BidderLogResDTO;
import com.project.dto.bidder.BidderRequestDTO;


public interface BidderService {
	BidderLogResDTO logIn(BidderLogReqDTO dto);
//	BidderRegisterResDTO register(BidderRequestDTO dto);
	List<BidderLogResDTO> getAllUsers();
	String signUp(BidderRequestDTO dto);
	BidderRegisterResDTO verifyUser(String email, String otp);
	String updateProfile(EditProfileDTO profileDto);
}
