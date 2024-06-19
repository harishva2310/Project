import axios from "axios";
import VehicleTypeModel from "../model/VehicleTypeModel";
export async function fetchVehicleData(): Promise<VehicleTypeModel[]> {
    const apiUrl = process.env.REACT_APP_API;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${apiUrl}/vehicleTypes`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return data.map((item: any) => new VehicleTypeModel(
        item.vehicle_type
    ));
}