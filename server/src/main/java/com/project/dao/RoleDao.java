package com.project.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Role;

public interface RoleDao extends JpaRepository<Role, Long> {
	Optional<Role> findByRoleName(String name);
}
