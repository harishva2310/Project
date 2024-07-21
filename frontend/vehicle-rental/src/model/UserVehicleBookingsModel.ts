class UserModelBookingsModel{
     vehicleBookingId : number;
      vehicleName : string;
      vehicleDescription: string;
      vehicleType: string;
      vehicleId : number;
      dayRate : number;
      locationId: number;
      locationName: string;
      locationDescription: string;
      locationAddress: string;
      locationCity: string;
      locationState: string;
      locationCountry: string;
      locationZip: string;
      fromDate: string;
      toDate: string;
      totalFare: number;
      userEmail: string;

    constructor(  vehicleBookingId : number,
        vehicleName : string,
        vehicleDescription: string,
        vehicleType: string,
        vehicleId : number,
        dayRate : number,
        locationId :number,
        locationName: string,
        locationDescription: string,
        locationAddress: string,
        locationCity: string,
        locationState: string,
        locationCountry: string,
        locationZip: string,
        fromDate: string,
        toDate: string,
        totalFare: number,
        userEmail: string

    ){
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

export default UserModelBookingsModel;