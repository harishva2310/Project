package com.homerental.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="VEHICLE_TYPE")
@Data
public class VehicleType {
    
    @Id
    @Column(name="vehicle_type")
    private String vehicle_type;

    
}
