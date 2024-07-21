package com.homerental.dev.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.dao.VehicleTypeRepository;
import com.homerental.dev.entity.VehicleType;
import com.nimbusds.oauth2.sdk.ParseException;




@RestController
@RequestMapping("/api/vehicleTypes")
public class VehicleTypeController {

    @Autowired
    private VehicleTypeRepository vehicleTypeRepository;

    @GetMapping
    public ResponseEntity<List<VehicleType>> getAllVehicleTypes() {
        List<VehicleType> vehicleTypes=vehicleTypeRepository.findAll();
        return ResponseEntity.ok(vehicleTypes);
    }

    @PostMapping
    public ResponseEntity<?> addVehicleType(@RequestParam("vehicle_type") String vehicle_type,@RequestParam("userEmail") String userEmail, JwtAuthenticationToken jwtAuthenticationToken) throws ParseException
    {
        String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
        System.out.println("authenticated email= " + authenticatedEmail);
        if (!userEmail.equals(authenticatedEmail)) {
            return ResponseEntity.status(403).build();
        }
        VehicleType vehicleType=new VehicleType();
        vehicleType.setVehicle_type(vehicle_type);
        vehicleTypeRepository.save(vehicleType);
        return ResponseEntity.ok("Vehicle Type saved successfully");

    }
    
    
}
