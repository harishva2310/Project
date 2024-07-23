package com.homerental.dev.controller;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.dao.VehicleLocationRepository;
import com.homerental.dev.entity.VehicleLocation;


@RestController
@RequestMapping("/api/vehicleLocations")
public class VehicleLocationController {
@Autowired
private VehicleLocationRepository vehiclelocationRepository;

    @GetMapping
    public ResponseEntity<List<VehicleLocation>> getAllLocations(){
        List<VehicleLocation> vehicleLocations=vehiclelocationRepository.findAll();
        return ResponseEntity.ok(vehicleLocations);
    }

    @GetMapping("/{vehicleLocationId}")
    public ResponseEntity<VehicleLocation> getVehicleLocationById(@PathVariable Long vehicleLocationId) {
        Optional<VehicleLocation> vehicleLocation = vehiclelocationRepository.findById(vehicleLocationId);
        if (vehicleLocation.isPresent()) {
            return ResponseEntity.ok(vehicleLocation.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicleLocation(
        @RequestParam("vehicle_id") Long vehicleId,
        @RequestParam("location_id") Long locationId,
        @RequestParam("user_email") String userEmail
        ,JwtAuthenticationToken jwtAuthenticationToken) throws ParseException
        {
            String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
            System.out.println("authenticated email= "+authenticatedEmail);
            if (!userEmail.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            VehicleLocation vehicleLocation=new VehicleLocation();
            vehicleLocation.setLocation_id(locationId);
            vehicleLocation.setVehicle_id(vehicleId);
            vehiclelocationRepository.save(vehicleLocation);
            return ResponseEntity.ok("Vehicle added to location successfully");
        }

}
