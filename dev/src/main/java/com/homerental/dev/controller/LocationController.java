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
import com.homerental.dev.entity.Location;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long locationId) {
        Optional<Location> location = locationRepository.findById(locationId);
        if (location.isPresent()) {
            return ResponseEntity.ok(location.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicleLocation(
            @RequestParam("location_name") String location_name,
            @RequestParam("location_description") String location_description,
            @RequestParam("location_address") String location_address,
            @RequestParam("location_city") String location_city,
            @RequestParam("location_state") String location_state,
            @RequestParam("location_country") String location_country,
            @RequestParam("location_zip") String location_zip,
            @RequestParam("userEmail") String userEmail,
            JwtAuthenticationToken jwtAuthenticationToken) throws ParseException {
        String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
        System.out.println("authenticated email= " + authenticatedEmail);
        if (!userEmail.equals(authenticatedEmail)) {
            return ResponseEntity.status(403).build();
        }
        Location location = new Location();
        location.setLocation_address(location_address);
        location.setLocation_city(location_city);
        location.setLocation_country(location_country);
        location.setLocation_description(location_description);
        location.setLocation_name(location_name);
        location.setLocation_state(location_state);
        location.setLocation_zip(location_zip);
        locationRepository.save(location);
        return ResponseEntity.ok("Location added successfully");
    }

}
