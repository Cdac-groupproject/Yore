package com.project.service;

import com.project.entity.Role;
import com.project.dao.RoleDao;
import com.project.service.RoleService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDao roleDao;

    public RoleServiceImpl(RoleDao roleRepository) {
        this.roleDao = roleRepository;
    }

    @Override
    public List<Role> getAllRoles() {
        return roleDao.findAll();
    }
}
