package com.homerental.dev.dao;


import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.homerental.dev.entity.Vehicle;
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query(value = """
            WITH booked_vehicles AS (
                SELECT
                    vb.vehicle_id
                FROM
                    vehicle v
                JOIN
                    vehicle_booking vb ON v.vehicle_id = vb.vehicle_id
                JOIN
                    vehicle_location vl ON vb.vehicle_location_id = vl.vehicle_location_id
                JOIN
                    location l ON vl.location_id = l.location_id
                WHERE
                    vb.from_date <= :todate
                    AND vb.to_date >= :fromdate
            )
            SELECT
                v1.vehicle_id,
                v1.vehicle_name
            FROM
                vehicle v1
            JOIN
                vehicle_location vl1 ON v1.vehicle_id = vl1.vehicle_id
            JOIN
                location l1 ON vl1.location_id = l1.location_id
            LEFT JOIN
                booked_vehicles bv ON v1.vehicle_id = bv.vehicle_id
            WHERE
                bv.vehicle_id IS NULL
                AND l1.location_city = :city
            """, nativeQuery = true)
    List<Object[]> findAvailableVehicles(@Param("fromdate") Timestamp fromDate, @Param("todate") Timestamp toDate, @Param("city") String city);
}
