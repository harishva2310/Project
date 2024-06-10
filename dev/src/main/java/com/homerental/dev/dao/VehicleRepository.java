package com.homerental.dev.dao;


import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.Vehicle;
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

}
