import axios from "axios";
import VehicleModel from "../model/VehicleModel";

export async function fetchVehicleData(): Promise<VehicleModel[]> {

    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${process.env.REACT_APP_API}/api/vehicles`, { responseType: 'json' }); // Adjust the endpoint as needed
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