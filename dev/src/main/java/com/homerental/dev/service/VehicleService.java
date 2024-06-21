package com.homerental.dev.service;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.homerental.dev.dao.VehicleRepository;


@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    

    public Page<Object[]> getAvailableVehicles(Timestamp fromDate, Timestamp toDate, String city, String country,Pageable pageable) {
        return vehicleRepository.findAvailableVehicles(fromDate, toDate, city, country, pageable);
    }
    
}