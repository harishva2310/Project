import axios from "axios";
import LocationModel from "../model/LocationModel";

export async function fetchLocationDataByID(location_id: number): Promise<LocationModel> {
    const apiUrl = process.env.REACT_APP_API;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${apiUrl}/locations/${location_id}`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return new LocationModel(
        
        data.location_id,
        data.location_name,
        data.location_description,
        data.location_address,
        data.location_city,
        data.location_state,
        data.location_country,
        data.location_zip

    );
}