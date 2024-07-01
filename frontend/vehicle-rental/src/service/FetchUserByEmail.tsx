import axios from "axios";
import UserModel from "../model/UserModel";

export async function fetchUserbyEmail(email: string): Promise<UserModel>{
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else
    {
        console.log(apiUrl);
    }
    const response = await axios.get(`/users/byemail?email=${email}`, { responseType: 'json' }); // Adjust the endpoint as needed
    const data = response.data;
    console.log(data);
    return new UserModel(
        
        data.user_id,
        data.user_first_name,
        data.user_last_name,
        data.user_address,
        data.user_driver_license_num,
        data.user_email

    );
}