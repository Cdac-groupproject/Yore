package com.project.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Gender;

public interface GenderDao extends JpaRepository<Gender, Long> {
	Optional<Gender> findByGenderNameIgnoreCase(String name);
}
