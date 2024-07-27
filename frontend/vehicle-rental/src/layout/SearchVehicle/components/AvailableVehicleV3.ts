class AvailableVehicleV3{
    vehicleId: number;
    vehicleName: string;
    vehicleLocationId: number;
    locationId: number;
    vehicleType: string;
    locationName: string;
    locationAddress: string;
    locationZip: string;
    dayRate: number;
    constructor (vehicleId: number,
        vehicleName: string,
        vehicleLocationId: number,
        locationId: number,
        vehicleType: string,
        locationName: string,
        locationAddress: string,
        locationZip: string,
        dayRate: number){
            this.vehicleId=vehicleId;
            this.vehicleName=vehicleName;
            this.vehicleLocationId=vehicleLocationId;
            this.locationId=locationId;
            this.vehicleType=vehicleType;
            this.locationName=locationName;
            this.locationAddress=locationAddress;
            this.locationZip=locationZip;
            this.dayRate=dayRate;
        }
}
export default AvailableVehicleV3;