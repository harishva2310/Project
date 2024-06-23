package com.homerental.dev.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.homerental.dev.dao.UserRepository;



@Service
public class UserService {
@Autowired
    private UserRepository userRepository;

    public List<Object[]> getUserEmailAddress(String email){
        return userRepository.findUserEmailAddress(email);
    }
    
    }

