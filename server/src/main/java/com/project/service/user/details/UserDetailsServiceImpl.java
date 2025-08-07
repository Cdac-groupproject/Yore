package com.project.service.user.details;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.dao.UserDao;
import com.project.entity.User;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{
	@Autowired
	private UserDao userDao;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		System.out.println("Testing");
		System.out.println("Email = " + email);
		User dbUser = userDao.findByEmail(email)
			.orElseThrow(() -> new UsernameNotFoundException("No user exists with email: " + email));
		return dbUser;
	}
}
