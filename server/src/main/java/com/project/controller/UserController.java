package com.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.AuctioneerDto;
import com.project.dto.user.UserRequestDTO;
import com.project.entity.User;
import com.project.service.user.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/users/manager/addEmployee")
    public ResponseEntity<?> signup(@RequestBody UserRequestDTO userRequestDTO) {
        User createdUser = userService.createUser(userRequestDTO);
        return ResponseEntity.ok("User created with email: " + createdUser.getEmail());
    }

    @GetMapping("/auctioneer/auctioneers")
    public ResponseEntity<List<AuctioneerDto>> getAuctioneers() {
        List<AuctioneerDto> auctioneers = userService.getAllAuctioneers();
        return ResponseEntity.ok(auctioneers);
    }

    // List all users
    @GetMapping("/api/users/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Delete user by ID
    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted with id: " + id);
    }
    
    // Update user by ID
    @PutMapping("/api/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO userRequestDTO) {
        User updatedUser = userService.updateUser(id, userRequestDTO);
        return ResponseEntity.ok(updatedUser);
    }
}
