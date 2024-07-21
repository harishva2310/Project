package com.homerental.dev.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.homerental.dev.dao.VehicleRepository;
import com.homerental.dev.entity.Vehicle;
import com.homerental.dev.responseModels.AvailableVehicles;


@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String VEHICLE_CACHE_KEY = "vehicles";

    public Page<Object[]> getAvailableVehicles(Timestamp fromDate, Timestamp toDate, String city, String country,Pageable pageable) {
        return vehicleRepository.findAvailableVehicles(fromDate, toDate, city, country, pageable);
    }

    public Page<AvailableVehicles> getAvailableVehiclesV2(Timestamp fromDate, Timestamp toDate, String city, String country,Pageable pageable) {
        List<Object[]> results = vehicleRepository.findAvailableVehiclesV2(fromDate, toDate, city, country, pageable);
        List<AvailableVehicles> availableVehicles = results.stream()
            .map(obj -> new AvailableVehicles(
                ((Number) obj[0]).longValue(), 
                (String) obj[1], 
                ((Number) obj[2]).longValue(), 
                ((Number) obj[3]).longValue(),
                (String) obj[4]
                ))
            .collect(Collectors.toList());
            long totalElements = vehicleRepository.countAvailableVehiclesV2(fromDate, toDate, city, country);
        return new PageImpl<>(availableVehicles, pageable, totalElements);
    }
    
    public void cacheVehicleData() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        redisTemplate.opsForValue().set(VEHICLE_CACHE_KEY, vehicles);
    }

    @Cacheable(cacheNames = "vehicles") // Name of the cache
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
}