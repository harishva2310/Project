package com.homerental.dev.dao;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.homerental.dev.entity.VehicleBooking;
import com.homerental.dev.responseModels.BookingResponse;
public interface VehicleBookingRepository extends JpaRepository<VehicleBooking, Long>{
    @Query(value = """
        select * from vehicle_booking where user_email=:email
        """,nativeQuery = true)
        List<VehicleBooking> findUserBookingByEmail(@Param("email") String email);

        @Query("SELECT new com.homerental.dev.responseModels.BookingResponse(" +
        "vb.vehicle_booking_id, " +
        "v.vehicle_name, " +
        "v.vehicle_description, " +
        "v.vehicle_type, " +
        "v.vehicle_id, " +
        "v.day_rate, " +
        "l.location_id, " +
        "l.location_name, " +
        "l.location_description, " +
        "l.location_address, " +
        "l.location_city, " +
        "l.location_state, " +
        "l.location_country, " +
        "l.location_zip, " +
        "vb.from_date, " +
        "vb.to_date, " +
        "vb.total_fare, " +
        "vb.user_email) " +
        "FROM VehicleBooking vb " +
        "JOIN Location l ON vb.location_id = l.location_id " +
        "JOIN Vehicle v ON vb.vehicle_id = v.vehicle_id " +
        "WHERE vb.user_email = :email " +
        "ORDER BY vb.vehicle_booking_id DESC")
    List<BookingResponse> findBookingsByUserEmail(@Param("email") String email);
}
