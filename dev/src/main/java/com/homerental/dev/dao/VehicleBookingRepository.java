package com.homerental.dev.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.homerental.dev.entity.VehicleBooking;
public interface VehicleBookingRepository extends JpaRepository<VehicleBooking, Long>{
    @Query(value = """
        select * from vehicle_booking where user_email=:email
        """,nativeQuery = true)
        List<VehicleBooking> findUserBookingByEmail(@Param("email") String email);
}
