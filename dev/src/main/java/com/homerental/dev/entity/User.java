package com.homerental.dev.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
 
@Entity
@Table(name="USERS")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long user_id;

    @Column(name="user_first_name")
    private String user_first_name;

    @Column(name="user_last_name")
    private String user_last_name;

    @Column(name="user_address")
    private String user_address;

    @Column(name="user_driver_license_num")
    private String user_driver_license_num;
}
