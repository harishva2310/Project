import axios from "axios";
import VehicleModel from "../model/VehicleModel";

export async function fetchVehicleData(): Promise<VehicleModel[]> {

    
    const response = await axios.get(`/api/vehicles/cacheVehicles`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return data.map((item: any) => new VehicleModel(
        item.vehicle_id,
        item.vehicle_name,
        item.vehicle_type,
        item.vehicle_description,
        item.day_rate,
        item.img
    ));
}