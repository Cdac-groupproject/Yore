package com.project.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entity.User;
import java.util.List;


public interface UserDao extends JpaRepository<User, Long> {
	boolean existsByEmail(String mail);
	
	Optional<User>findByEmail(String email);
	
	Optional<User>findByEmailAndPassword(String email, String password);


	Optional<User> findById(Long auctioneerId);

	List<User> findByRole_RoleNameIgnoreCase(String roleName);
}
