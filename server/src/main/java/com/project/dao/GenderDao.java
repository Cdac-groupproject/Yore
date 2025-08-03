package com.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Gender;

public interface GenderDao extends JpaRepository<Gender, Long> {
	
}
