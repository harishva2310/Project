package com.homerental.dev.responseModels;

import java.util.Date;

import lombok.Data;

@Data
public class BookingResponse {
    private Long vehicleBookingId;
    private String vehicleName;
    private String vehicleDescription;
    private String vehicleType;
    private Long vehicleId;
    private Double dayRate;
    private Long locationId;
    private String locationName;
    private String locationDescription;
    private String locationAddress;
    private String locationCity;
    private String locationState;
    private String locationCountry;
    private String locationZip;
    private Date fromDate;
    private Date toDate;
    private Double totalFare;
    private String userEmail;

    public BookingResponse(Long vehicleBookingId, String vehicleName, String vehicleDescription, String vehicleType, Long vehicleId, Double dayRate, Long locationId, String locationName, String locationDescription, String locationAddress, String locationCity, String locationState, String locationCountry, String locationZip, Date fromDate, Date toDate, Double totalFare, String userEmail) {
        this.vehicleBookingId = vehicleBookingId;
        this.vehicleName=vehicleName;
        this.vehicleDescription=vehicleDescription;
        this.vehicleType=vehicleType;
        this.vehicleId=vehicleId;
        this.dayRate=dayRate;
        this.locationId=locationId;
        this.locationName=locationName;
        this.locationDescription=locationDescription;
        this.locationAddress=locationAddress;
        this.locationCity=locationCity;
        this.locationState=locationState;
        this.locationCountry=locationCountry;
        this.locationZip=locationZip;
        this.fromDate=fromDate;
        this.toDate=toDate;
        this.totalFare=totalFare;
        this.userEmail = userEmail;
      }
    
    
}
