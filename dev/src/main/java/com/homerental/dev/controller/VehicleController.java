package com.homerental.dev.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.homerental.dev.dao.VehicleRepository;
import com.homerental.dev.entity.Vehicle;
import com.homerental.dev.service.VehicleService;
@RestController
@RequestMapping("/vehicles")
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

    @GetMapping("/vehicles/{vehicleId}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long vehicleId) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleId);
        if (vehicle.isPresent()) {
            return ResponseEntity.ok(vehicle.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/availablevehicles")
    public ResponseEntity<List<Object[]>> getAvailableVehicles(
            @RequestParam("fromdate") String fromDateStr,
            @RequestParam("todate") String toDateStr,
            @RequestParam("city") String city) {
        try {
            Timestamp fromDate = Timestamp.valueOf(fromDateStr.replace("T", " "));
            Timestamp toDate = Timestamp.valueOf(toDateStr.replace("T", " "));
            List<Object[]> availableVehicles = vehicleService.getAvailableVehicles(fromDate, toDate, city);
            return ResponseEntity.ok(availableVehicles);
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
            @RequestParam("img" ) MultipartFile img) {

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
