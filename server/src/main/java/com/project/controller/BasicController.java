package com.project.controller;

import com.project.entity.Gender;
import com.project.entity.Role;
import com.project.service.GenderService;
import com.project.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BasicController {  

    private final GenderService genderService;
    private final RoleService roleService;

    public BasicController(GenderService genderService, RoleService roleService) {
        this.genderService = genderService;
        this.roleService = roleService;
    }

    @GetMapping("/genders")
    public ResponseEntity<List<Gender>> getGenders() {
        List<Gender> genders = genderService.getAllGenders();
        if (genders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(genders);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = roleService.getAllRoles();
        if (roles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(roles);
    }
}
