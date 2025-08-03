package com.project.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.entity.Role;

public interface RoleDao extends JpaRepository<Role, Long> {

}
