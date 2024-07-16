class AvailableVehicleV2{
    vehicleId: number;
    vehicleName: string;
    vehicleLocationId: number;
    locationId: number;
    constructor (vehicleId: number,
        vehicleName: string,
        vehicleLocationId: number,
        locationId: number){
            this.vehicleId=vehicleId;
            this.vehicleName=vehicleName;
            this.vehicleLocationId=vehicleLocationId;
            this.locationId=locationId;
        }
}
export default AvailableVehicleV2;