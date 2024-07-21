package com.homerental.dev.entity;

import org.springframework.data.redis.core.RedisHash;

import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@RedisHash("Vehicle")
@Getter
@Setter
@Data
@NoArgsConstructor
public class VehicleCache {
    @Id
    private Long vehicleId;

    
    private String vehicleDescription;
    private String vehicleName;
    private String vehicleType;
    private Double dayRate;
    private byte[] img;


}
