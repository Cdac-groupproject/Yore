package com.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.dto.user.UserRequestDTO;
import com.project.entity.User;
import com.project.service.user.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/manager/addEmployee")
    public ResponseEntity<?> signup(@RequestBody UserRequestDTO userRequestDTO) {
        User createdUser = userService.createUser(userRequestDTO);
        return ResponseEntity.ok("User created with email: " + createdUser.getEmail());
    }
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
}
