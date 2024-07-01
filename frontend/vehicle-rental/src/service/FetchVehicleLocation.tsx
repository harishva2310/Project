import axios from "axios";
import VehicleLocationModel from "../model/VehicleLocationModel";

export async function fetchVehicleLocationData(): Promise<VehicleLocationModel[]> {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`/vehicleLocations`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return data.map((item: any) => new VehicleLocationModel(
        item.vehicle_location_id,
        item.vehicle_id,
        item.location_id
    ));
}