package com.homerental.dev.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
public class VehicleCache {
    private Long vehicleId;
    private String vehicleDescription;
    private String vehicleName;
    private String vehicleType;
    private Double dayRate;
    private String img;


}
