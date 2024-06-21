import axios from "axios";
import LocationModel from "../model/LocationModel";

export async function fetchLocationDataByID(location_id: number): Promise<LocationModel[]> {
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
    return data.map((item: any) => new LocationModel(
        
        item.location_id,
        item.location_name,
        item.location_description,
        item.location_address,
        item.location_city,
        item.location_state,
        item.location_country,
        item.location_zip

    ));
}