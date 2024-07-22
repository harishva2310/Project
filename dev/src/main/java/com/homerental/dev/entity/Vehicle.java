package com.homerental.dev.entity;




import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="VEHICLE")
@Data
public class Vehicle implements Serializable{

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name="vehicle_name")
    private String vehicle_name;

    @Column(name="vehicle_description")
    private String vehicle_description;

    @Column(name="vehicle_type")
    private String vehicle_type;

    @Column(name="day_rate")
    private Double day_rate;

    @Column(name="img")
    @Lob
    private byte[] img;
}
