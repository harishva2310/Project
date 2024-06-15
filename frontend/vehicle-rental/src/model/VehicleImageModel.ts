class VehicleImageModel{
    vehicle_image_id:number;
    vehicle_id: number;
    vehicle_name: string;
    vehicle_image: string;
    
    constructor(vehicle_image_id:number,
        vehicle_id: number,
        vehicle_name: string,
        vehicle_image: string)
        {
            this.vehicle_image_id=vehicle_image_id;
            this.vehicle_id=vehicle_id;
            this.vehicle_name=vehicle_name;
            this.vehicle_image=vehicle_image;

        }
}
export default VehicleImageModel;