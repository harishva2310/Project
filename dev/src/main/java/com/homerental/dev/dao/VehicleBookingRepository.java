package com.homerental.dev.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.homerental.dev.entity.VehicleBooking;
public interface VehicleBookingRepository extends JpaRepository<VehicleBooking, Long>{

}
