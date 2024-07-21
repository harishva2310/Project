package com.homerental.dev.responseModels;

public class AvailableVehicles {
    private Long vehicleId;
    private String vehicleName;
    private Long vehicleLocationId;
    private Long locationId;
    private String vehicleType;

    public AvailableVehicles(Long vehicleId, String vehicleName, Long vehicleLocationId, Long locationId, String vehicleType) {
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.vehicleLocationId = vehicleLocationId;
        this.locationId = locationId;
        this.vehicleType=vehicleType;
    }
    // Getters and setters
    
    public Long getVehicleId() {
        return vehicleId;
    }

    
    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    
    public String getVehicleName() {
        return vehicleName;
    }

    
    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    
    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    
    public Long getVehicleLocationId() {
        return vehicleLocationId;
    }

    
    public void setVehicleLocationId(Long vehicleLocationId) {
        this.vehicleLocationId = vehicleLocationId;
    }

    
    public Long getLocationId() {
        return locationId;
    }

    
    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

}
