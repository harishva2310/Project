class VehicleModel{
    vehicle_id?: number;
    vehicle_name: string;
    vehicle_type: string;
    vehicle_description: string;
    day_rate: number;
    img: string | null;
    constructor (vehicle_id: number | undefined,
        vehicle_name: string,
        vehicle_type: string,
        vehicle_description: string,
        day_rate: number,
        img: string | null
    )
        {
            this.vehicle_id=vehicle_id;
            this.vehicle_name=vehicle_name;
            this.vehicle_type=vehicle_type;
            this.vehicle_description=vehicle_description;
            this.day_rate=day_rate;
            this.img=img;

        }
}
export default VehicleModel;