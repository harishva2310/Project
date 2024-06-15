package com.homerental.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="VEHICLE_IMAGES")
@Data
public class VehicleImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_image_id")
    private Long vehicle_image_id;

    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name="vehicle_name")
    private String vehicle_name;

    @Column(name="vehicle_image")
    private String vehicle_image;
}
