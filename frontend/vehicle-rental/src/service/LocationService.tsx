import axios from "axios";
import LocationModel from "../model/LocationModel";

export async function fetchLocationData(): Promise<LocationModel[]> {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`${process.env.REACT_APP_API}/api/locations`, { responseType: 'json' }); // Adjust the endpoint as needed
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