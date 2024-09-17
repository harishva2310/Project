import axios from "axios";
import VehicleBookingModel from "../model/VehicleBookingModel";

import { useEffect, useState } from "react";
import { AccessToken, AuthState } from "@okta/okta-auth-js";


export async function fetchUserBookingData(email: string): Promise<VehicleBookingModel[]> {
    
    
    
        const response = await axios.get(`${process.env.REACT_APP_API}/api/vehicleBookings/getuserbookings?email=${email}`, {
            responseType: 'json',
            
        });

        const data = response.data;
        console.log("User booking data:", data);
        return data.map((item: any) => new VehicleBookingModel(
            item.vehicle_booking_id,
            item.location_id,
            item.vehicle_id,
            item.user_email,
            item.vehicle_location_id,
            item.from_date,
            item.to_date,
            item.total_fare
        ));
    

    
}