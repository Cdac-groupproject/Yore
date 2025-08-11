package com.project.service.user;

import java.util.List;

import com.project.dto.AuctioneerDto;
import com.project.dto.Credentials;
import com.project.dto.user.UserRequestDTO;
import com.project.entity.User;

public interface UserService {
	User getUserByEmail(String email);

	User getUserByCredentials(Credentials cr);
	
	User createUser(UserRequestDTO userDto);

	List<AuctioneerDto> getAllAuctioneers();
	
	List<User> getAllUsers();
	
    void deleteUserById(Long id);
    
    User updateUser(Long id, UserRequestDTO userDto);
}
