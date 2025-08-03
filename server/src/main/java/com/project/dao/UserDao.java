package com.project.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Product;
import com.project.entity.User;

public interface UserDao extends JpaRepository<User, Long>{

	Optional<User> findById(Long auctioneerId);

}
