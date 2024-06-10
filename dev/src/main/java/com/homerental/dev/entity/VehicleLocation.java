package com.homerental.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="VEHICLE_LOCATION")
@Data
public class VehicleLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_location_id")
    private Long vehicle_location_id;

    @Column(name = "location_id")
    private Long location_id;

    @Column(name="location_name")
    private String location_name;

    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name="vehicle_name")
    private String vehicle_name;

    
}
