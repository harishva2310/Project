import axios from "axios";
import VehicleLocationModel from "../model/VehicleLocationModel";

export async function fetchVehicleLocationDataByID(vehicle_location_id: number): Promise<VehicleLocationModel> {
    const apiUrl = process.env.REACT_APP_API;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${apiUrl}/vehicleLocations/${vehicle_location_id}`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return new VehicleLocationModel(
        data.vehicle_location_id,
        data.vehicle_id,
        data.location_id
    );
}