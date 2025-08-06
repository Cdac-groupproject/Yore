package com.project.dao.product;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.CountryRef;

public interface CountryRefDao extends JpaRepository<CountryRef, Long> {
	
}
