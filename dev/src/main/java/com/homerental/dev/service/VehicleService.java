package com.homerental.dev.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.homerental.dev.dao.VehicleRepository;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Object[]> getAvailableVehicles(Timestamp fromDate, Timestamp toDate, String city) {
        return vehicleRepository.findAvailableVehicles(fromDate, toDate, city);
    }
}