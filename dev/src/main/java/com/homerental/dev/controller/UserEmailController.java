package com.homerental.dev.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.dao.UserRepository;
import com.homerental.dev.entity.User;
import com.homerental.dev.service.UserService;


@RestController
@RequestMapping("/users")
public class UserEmailController{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users=userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/byemail")
    public ResponseEntity<List<Object[]>> getUserEmailAddress(
        @RequestParam String email) {
    try {
    List<Object[]> userbyEmail=userService.getUserEmailAddress(email); 
    return ResponseEntity.ok(userbyEmail);

    }
    catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(null);
    }
  }
}