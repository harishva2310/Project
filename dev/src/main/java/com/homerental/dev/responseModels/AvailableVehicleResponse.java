package com.homerental.dev.responseModels;

import lombok.Data;

@Data
public class AvailableVehicleResponse{
  private Long vehicleId;
  private String vehicleName;
  private Long vehicleLocationId;
  private Long locationId;
}
