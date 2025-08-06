package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.dto.bidder.BidderLogReqDTO;
import com.project.dto.bidder.BidderLogResDTO;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.dto.bidder.BidderRequestDTO;
import com.project.security.JwtUtil;
import com.project.service.bidder.BidderService;

import jakarta.validation.Valid;


@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST})
public class BidderController {

	@Autowired
	private BidderService bidderService;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/signin")
	public ResponseEntity<?> signIn(@Valid @RequestBody BidderLogReqDTO dto){
		System.out.println("SIGNIN API HIT");

		Authentication auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
		System.out.println(auth);
		Authentication authenticated = authenticationManager.authenticate(auth);
		System.out.println(authenticated);

		String token = jwtUtil.createToken(authenticated);
		System.out.println(token);

		return ResponseEntity.ok(token);
	}

//	@PostMapping("/signup")
//	public ResponseEntity<?> signUp(@Valid @RequestBody BidderRequestDTO dto) {
//		BidderRegisterResDTO response = bidderService.register(dto);
//		return ResponseEntity.status(HttpStatus.CREATED).body(response);
//	}	 
	
//	After verify user
//	After otp verification
	@PostMapping("/sign-up")
	public ResponseEntity<?> signUp(@RequestBody BidderRequestDTO dto){
		String msg = bidderService.signUp(dto);
		return ResponseEntity.ok(msg);
	}
	
	@PostMapping("/verify-user")
	public ResponseEntity<?> verifyUser(@RequestParam String email, @RequestParam String otp){
		BidderRegisterResDTO dto = bidderService.verifyUser(email, otp);
		return ResponseEntity.ok(dto);
	}
	
	@GetMapping("/users")
	public ResponseEntity<?> getAllUsers(){
		List<BidderLogResDTO> users = bidderService.getAllUsers();
		if(users == null)
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		
		return ResponseEntity.ok(users);
	}
}
