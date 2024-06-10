package com.homerental.dev.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="VEHICLE_BOOKING")
@Data
public class VehicleBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_booking_id")
    private Long vehicle_booking_id;

    @Column(name = "location_id")
    private Long location_id;

    @Column(name = "user_id")
    private Long user_id;

    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name = "vehicle_location_id")
    private Long vehicle_location_id;

    @Column(name="vehicle_name")
    private String vehicle_name;

    @Column(name="location_name")
    private String location_name;

    @Column(name="from_date")
    private Date from_Date;

    @Column(name="to_date")
    private Date to_date;
}
