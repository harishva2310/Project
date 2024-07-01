import axios from "axios";
import VehicleBookingModel from "../model/VehicleBookingModel";

export async function fetchVehicleBookingData(): Promise<VehicleBookingModel[]> {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`/vehicleBookings`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return data.map((item: any) => new VehicleBookingModel(
        item.vehicle_booking_id,
        item.vehicle_location_id,
        item.vehicle_id,
        item.location_id,
        item.user_id,
        item.from_date,
        item.to_date,
        item.total_fare
    ));
}