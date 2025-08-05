package com.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.entity.EmployeeCategory;

public interface EmployeeCategoryDao extends JpaRepository<EmployeeCategory, Integer> {
	
}