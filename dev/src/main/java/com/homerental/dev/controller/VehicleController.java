package com.homerental.dev.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.homerental.dev.dao.VehicleRepository;
import com.homerental.dev.entity.Vehicle;
import com.homerental.dev.responseModels.AvailableVehicles;
import com.homerental.dev.service.VehicleService;
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleService vehicleService;

    

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long vehicleId) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        if (vehicle.isPresent()) {
            return ResponseEntity.ok(vehicle.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/availablevehicles")
    public ResponseEntity<Page<Object[]>> getAvailableVehicles(
            @RequestParam("fromdate") String fromDateStr,
            @RequestParam("todate") String toDateStr,
            @RequestParam("city") String city,
            @RequestParam("country") String country,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Timestamp fromDate = Timestamp.valueOf(fromDateStr.replace("T", " "));
            Timestamp toDate = Timestamp.valueOf(toDateStr.replace("T", " "));
            Pageable pageable = PageRequest.of(page, size);
            Page<Object[]> availableVehiclesV1 = vehicleService.getAvailableVehicles(fromDate, toDate, city, country, pageable);
            return ResponseEntity.ok(availableVehiclesV1);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    @GetMapping("/v2/availablevehicles")
    public ResponseEntity<Page<AvailableVehicles>> getAvailableVehiclesV2(
            @RequestParam("fromdate") String fromDateStr,
            @RequestParam("todate") String toDateStr,
            @RequestParam("city") String city,
            @RequestParam("country") String country,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Timestamp fromDate = Timestamp.valueOf(fromDateStr.replace("T", " "));
            Timestamp toDate = Timestamp.valueOf(toDateStr.replace("T", " "));
            Pageable pageable = PageRequest.of(page, size);
            Page<AvailableVehicles> availableVehiclesV2 = vehicleService.getAvailableVehiclesV2(fromDate, toDate, city, country, pageable);
            return ResponseEntity.ok(availableVehiclesV2);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicle(
            @RequestParam("vehicle_name") String vehicleName,
            @RequestParam("vehicle_description") String vehicleDescription,
            @RequestParam("vehicle_type") String vehicleType,
            @RequestParam("day_rate") Double dayRate,
            @RequestParam("img" ) MultipartFile img,
            @RequestParam("user_email") String userEmail,
            JwtAuthenticationToken jwtAuthenticationToken) throws ParseException {
                String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
                System.out.println("authenticated email= "+authenticatedEmail);
                if (!userEmail.equals(authenticatedEmail)) {
                    return ResponseEntity.status(403).build();
                }
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicle_name(vehicleName);
        vehicle.setVehicle_description(vehicleDescription);
        vehicle.setVehicle_type(vehicleType);
        vehicle.setDay_rate(dayRate);
        try {
            vehicle.setImg(img.getBytes()); // Convert MultipartFile to byte array
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image");
        }

        vehicleRepository.save(vehicle);

        return ResponseEntity.ok("Vehicle added successfully");
    }
}
