package com.project.service.bidder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.UserDao;
import com.project.dao.GenderDao;
import com.project.dao.RoleDao;
import com.project.dto.ApiResponseDTO;
import com.project.dto.EditProfileDTO;
import com.project.dto.bidder.BidderRegisterResDTO;
import com.project.dto.bidder.BidderRequestDTO;
import com.project.dto.bidder.BidderLogReqDTO;
import com.project.dto.bidder.BidderLogResDTO;
import com.project.entity.Gender;
import com.project.entity.Role;
import com.project.entity.User;
import com.project.service.EmailService;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class BidderServiceImpl implements BidderService {

	private  UserDao userDao;
	private GenderDao genderDao;
	private RoleDao roleDao;
	private PasswordEncoder passwordEncoder;
	private ModelMapper mapper;
	private EmailService emailService;
	
	private  Map<String, String> otpMap = new ConcurrentHashMap<>();
	private  Map<String, BidderRequestDTO> pendingUsers = new ConcurrentHashMap<>();
//
//	@Override
//	public BidderLogResDTO logIn(BidderLogReqDTO dto) {
//		User entity = userDao.findByEmail(dto.getEmail())
//				.orElseThrow(() -> new ApiException("Email id not found"));
//
//		// Match raw password with encrypted one
//		if (!passwordEncoder.matches(dto.getPassword(), entity.getPassword())) {
//			throw new ApiException("Invalid password");
//		}
//
//		BidderLogResDTO resdto = new BidderLogResDTO();
//		resdto.setFullName(entity.getFullName());
//		resdto.setEmail(entity.getEmail());
//		resdto.setPhoneNo(entity.getPhoneNo());
//		resdto.setAge(entity.getAge());
//		resdto.setGender(entity.getGender().getGenderName());
//		resdto.setRole(entity.getRole().getRoleName());
//
//		return resdto;
//	}






	@Override
	public List<BidderLogResDTO> getAllUsers() {
		List<User> allUsers = userDao.findAll();
		List<BidderLogResDTO> userRes = allUsers.stream().map(user ->  {
		BidderLogResDTO dto = new BidderLogResDTO();
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNo(user.getPhoneNo());
        dto.setAge(user.getAge());
        dto.setGender(user.getGender() != null ? user.getGender().getGenderName() : null);
        dto.setRole(user.getRole() != null ? user.getRole().getRoleName() : null);
        return dto;})
				.toList();
		return userRes;
	}






//	@Override
//	public BidderRegisterResDTO register(BidderRequestDTO dto) {
//		if(userDao.existsByEmail(dto.getEmail())) 
//			throw new ApiException("Email already registered!!!");
//		
//		Gender gender = genderDao.findById(dto.getGenderId())
//				.orElseThrow(() -> new ApiException("Gender id not valid"));
//
//		Role role = roleDao.findById(dto.getRoleId())
//				.orElseThrow(() -> new ApiException("Role is not valid"));
//
//		User entity = mapper.map(dto, User.class);
////		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
//		entity.setGender(gender);
//		entity.setRole(role);
//		userDao.save(entity);
//
//		
//		BidderRegisterResDTO resdto = new BidderRegisterResDTO();
//		resdto.setFullName(dto.getFullName());
//		resdto.setEmail(dto.getEmail());
//		resdto.setPhoneNo(dto.getPhoneNo());
//		resdto.setAge(dto.getAge());
//		resdto.setGenderId(dto.getGenderId());
//		resdto.setRoleId(dto.getRoleId());
//
//		return resdto;
//	}






	@Override
	public String signUp(BidderRequestDTO dto) {
		if(userDao.existsByEmail(dto.getEmail())) 
			throw new ApiException("Email already registered!!!");
		
		Gender gender = genderDao.findById(dto.getGenderId())
				.orElseThrow(() -> new ApiException("Gender id not valid"));
		
//		Role role = roleDao.findById(dto.getRoleId())
//				.orElseThrow(() -> new ApiException("Role is not valid"));
		Role role = roleDao.findByRoleName("BIDDER").orElseThrow(() -> new ApiException("Role Not Found"));

		String otp = String.format("%06d", new Random().nextInt(100000));
		otpMap.put(dto.getEmail(), otp);
		pendingUsers.put(dto.getEmail(), dto);
		
//		Send otp
		String subject = "OTP for Registration";
	    String body = "Your OTP is: " + otp;
	    emailService.sendEmail(dto.getEmail(), subject, body);
		
		
	    return "OTP sent successfully. Please verify to complete registration.";
			}



	@Override
	public BidderRegisterResDTO verifyUser(String email, String otp) {
		if(!otpMap.containsKey(email) || !otpMap.get(email).equals(otp)) 
			throw new ApiException("Invalid or expired otp");
		
		
//		OTP validation
		BidderRequestDTO dto = pendingUsers.get(email);
		if(dto == null) 
			throw new ApiException("No Pending request");
		
		Gender gender = genderDao.findById(dto.getGenderId())
				.orElseThrow(() -> new ApiException("Gender id not valid"));
		
//		Role role = roleDao.findById(dto.getRoleId())
//				.orElseThrow(() -> new ApiException("Role is not valid"));
		Role role = roleDao.findByRoleName("BIDDER").orElseThrow(() -> new ApiException("Role Not Found"));
		
		User entity = mapper.map(dto, User.class);

		entity.setPassword(passwordEncoder.encode(dto.getPassword()));

		entity.setGender(gender);
		entity.setRole(role);
		//entity.setOtp(otp);
		//entity.setVerified(true);
		User newUser = userDao.save(entity);
		
//		Clean up
		pendingUsers.remove(email);
		otpMap.remove(email);
		
//		Response preparing
		BidderRegisterResDTO resdto = new BidderRegisterResDTO();
		resdto.setFullName(dto.getFullName());
		resdto.setEmail(dto.getEmail());
		resdto.setPhoneNo(dto.getPhoneNo());
		resdto.setAge(dto.getAge());
		resdto.setGenderId(dto.getGenderId());
		resdto.setRoleId(role.getRoleName());	
		return resdto;
	}
	@Override
	public String updateProfile(EditProfileDTO profileDto) {
		User user = userDao.findByEmail(profileDto.getEmail()).orElseThrow(() -> new ApiException("User not found"));
		user.setFullName(profileDto.getFullName());
		user.setAge(profileDto.getAge());
		user.setPhoneNo(profileDto.getPhoneNo());
		userDao.save(user);
		return "User updated successfully";
		}






	@Override
	public BidderLogResDTO getUser(Long id) {
		User user = userDao.findById(id).orElseThrow(() -> new ApiException("User not found with given id"));
		return mapper.map(user, BidderLogResDTO.class);
	}
	}










	

