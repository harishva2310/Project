package com.homerental.dev.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.VehicleLocation;
public interface VehicleLocationRepository extends JpaRepository<VehicleLocation, Long> {

}
