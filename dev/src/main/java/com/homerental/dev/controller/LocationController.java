package com.homerental.dev.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.dao.LocationRepository;
import com.homerental.dev.entity.Location;




@RestController
@RequestMapping("/locations")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations(){
        List<Location> locations=locationRepository.findAll();
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/locations/{location_id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long locationId) {
        Optional<Location> location = locationRepository.findById(locationId);
        if (location.isPresent()) {
            return ResponseEntity.ok(location.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    
}
