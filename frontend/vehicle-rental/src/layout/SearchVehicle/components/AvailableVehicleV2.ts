class AvailableVehicleV2{
    vehicleId: number;
    vehicleName: string;
    vehicleLocationId: number;
    locationId: number;
    vehicleType: string;
    constructor (vehicleId: number,
        vehicleName: string,
        vehicleLocationId: number,
        locationId: number,
        vehicleType: string){
            this.vehicleId=vehicleId;
            this.vehicleName=vehicleName;
            this.vehicleLocationId=vehicleLocationId;
            this.locationId=locationId;
            this.vehicleType=vehicleType;
        }
}
export default AvailableVehicleV2;