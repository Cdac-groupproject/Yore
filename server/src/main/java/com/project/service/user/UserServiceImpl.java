package com.project.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;import com.project.dao.UserDao;
import com.project.dto.Credentials;
import com.project.entity.User;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserDao userDao;
	
	private PasswordEncoder passwordEncoder;
	
	public UserServiceImpl(UserDao userDao) {
		this.userDao = userDao;
	}
	
	@Override
	public User getUserByEmail(String email) {
		
		return userDao.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
	}

	@Override
	public User getUserByCredentials(Credentials cr) {
		User dbUser = userDao.findByEmail(cr.getEmail())
			.orElseThrow(() -> new UsernameNotFoundException("User not found with the email"));

		if (passwordEncoder.matches(cr.getPassword(), dbUser.getPassword())) {
			return dbUser;
		}
		return null;
	}



}
