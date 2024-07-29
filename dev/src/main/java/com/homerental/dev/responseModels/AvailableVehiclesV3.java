package com.homerental.dev.responseModels;

public class AvailableVehiclesV3 {
    private Long vehicleId;
    private String vehicleName;
    private Long vehicleLocationId;
    private Long locationId;
    private String vehicleType;
    private String locationName;
    private String locationAddress;
    private String locationZip;
    private Double dayRate; 
    private String vehicleDescription;
    private String img;


    public AvailableVehiclesV3(Long vehicleId, String vehicleName, Long vehicleLocationId, Long locationId, String vehicleType,String locationName,String locationAddress,String locationZip, Double dayRate, String vehicleDescription, String img) {
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.vehicleLocationId = vehicleLocationId;
        this.locationId = locationId;
        this.vehicleType=vehicleType;
        this.locationName=locationName;
        this.locationAddress=locationAddress;
        this.locationZip=locationZip;
        this.dayRate=dayRate;
        this.vehicleDescription=vehicleDescription;
        this.img=img;
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

    public String getLocationAddress(){
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress){
        this.locationAddress=locationAddress;
    }
    
    public String getLocationZip(){
        return locationZip;
    }

    public void setLocationZip(String locationZip){
        this.locationZip=locationZip;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getDayRate() {
        return dayRate;
    }

    public void setDayRate(Double dayRate) {
        this.dayRate = dayRate;
    }

    public String getVehicleDescription() {
        return vehicleDescription;
    }

    public void setVehicleDescription(String vehicleDescription) {
        this.vehicleDescription = vehicleDescription;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
