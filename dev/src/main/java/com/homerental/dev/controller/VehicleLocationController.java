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

import com.homerental.dev.dao.LocationRepository;
import com.homerental.dev.dao.VehicleLocationRepository;
import com.homerental.dev.dao.VehicleRepository;
import com.homerental.dev.entity.Location;
import com.homerental.dev.entity.Vehicle;
import com.homerental.dev.entity.VehicleLocation;
import com.homerental.dev.service.KafkaProducerService;


@RestController
@RequestMapping("/api/vehicleLocations")
public class VehicleLocationController {
@Autowired
private VehicleLocationRepository vehiclelocationRepository;

@Autowired
private LocationRepository locationRepository;

@Autowired
private KafkaProducerService kafkaProducerService;

@Autowired
private VehicleRepository vehicleRepository;

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

            Optional<Vehicle> vehicle=vehicleRepository.findById(vehicleId);
            Optional<Location> location=locationRepository.findById(locationId);
            if(vehicle.isPresent() && location.isPresent())
            {
                Vehicle vehicleEntity=vehicle.get();
                Location locationEntity=location.get();
                String locationCity=locationEntity.getLocation_city();
                String locationName=locationEntity.getLocation_name();
                String vehicleName=vehicleEntity.getVehicle_name();
                String message = String.format("%s is now available at %s at our %s location. Book now!", vehicleName, locationCity,locationName);
                kafkaProducerService.sendMessage(message);
            }
            return ResponseEntity.ok("Vehicle added to location successfully");
        }

}
