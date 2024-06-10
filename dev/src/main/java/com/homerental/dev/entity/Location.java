package com.homerental.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="LOCATION")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long location_id;

    @Column(name="location_name")
    private String location_name;

    @Column(name="location_description")
    private String location_description;

    @Column(name="location_address")
    private String location_address;

    @Column(name="location_city")
    private String location_city;

    @Column(name="location_state")
    private String location_state;

    @Column(name="location_country")
    private String location_country;

    @Column(name="location_zip")
    private String location_zip;
}
