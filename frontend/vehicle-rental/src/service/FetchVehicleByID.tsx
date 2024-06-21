import axios from "axios";
import VehicleModel from "../model/VehicleModel";



export async function fetchVehicleDataByID(vehicle_id: number): Promise<VehicleModel[]> {
    const apiUrl = process.env.REACT_APP_API;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${apiUrl}/vehicles/${vehicle_id}`, { responseType: 'json' }); // Adjust the endpoint as needed
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