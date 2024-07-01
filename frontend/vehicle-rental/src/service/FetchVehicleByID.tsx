import axios from "axios";
import VehicleModel from "../model/VehicleModel";



export async function fetchVehicleDataByID(vehicle_id: number): Promise<VehicleModel> {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`/vehicles/${vehicle_id}`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return new VehicleModel(
        data.vehicle_id,
        data.vehicle_name,
        data.vehicle_type,
        data.vehicle_description,
        data.day_rate,
        data.img
    );
}