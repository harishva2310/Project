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
    vehicleDescription: string;
    img: string;
    constructor (vehicleId: number,
        vehicleName: string,
        vehicleLocationId: number,
        locationId: number,
        vehicleType: string,
        locationName: string,
        locationAddress: string,
        locationZip: string,
        dayRate: number,
        vehicleDescription: string,
        img: string){
            this.vehicleId=vehicleId;
            this.vehicleName=vehicleName;
            this.vehicleLocationId=vehicleLocationId;
            this.locationId=locationId;
            this.vehicleType=vehicleType;
            this.locationName=locationName;
            this.locationAddress=locationAddress;
            this.locationZip=locationZip;
            this.dayRate=dayRate;
            this.vehicleDescription=vehicleDescription;
            this.img=img;
        }
}
export default AvailableVehicleV3;