class VehicleLocationModel{
    vehicle_location_id?: number;
    location_id: number;
    vehicle_id: number;
    
    constructor (vehicle_location_id: number | undefined,
        location_id: number,
    vehicle_id: number
    )
        {
            this.vehicle_location_id=vehicle_location_id;
            this.location_id=location_id;
            this.vehicle_id=vehicle_id;
            

        }
}
export default VehicleLocationModel;