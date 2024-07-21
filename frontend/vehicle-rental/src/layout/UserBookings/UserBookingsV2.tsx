import { useEffect, useState } from "react";
import LocationModel from "../../model/LocationModel";
import VehicleModel from "../../model/VehicleModel";
import { useOktaAuth } from "@okta/okta-react";
import { CustomUserClaims, UserClaims } from "@okta/okta-auth-js";
import UserModel from "../../model/UserModel";
import { fetchLocationDataByID } from "../../service/FetchLocationByID";
import VehicleBookingModel from "../../model/VehicleBookingModel";
import axios from "axios";

import { fetchVehicleDataByID } from "../../service/FetchVehicleByID";
import { SpinnerLoading } from "../../util/SpinnerLoading";
import { useNavigate } from "react-router-dom";
import UserVehicleBookingsModel from "../../model/UserVehicleBookingsModel";


const UserBookingsV2 = () => {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    const [locations, setLocations] = useState<Record<number, LocationModel>>({});
    const [vehicles, setVehicles] = useState<Record<number, VehicleModel>>({});
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<UserVehicleBookingsModel[]>([]);


    const formatDate = (isoDateString: string): string => {
        const date = new Date(isoDateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
        return date.toLocaleDateString('en-US', options);
    };


    useEffect(() => {
        console.log(authState, oktaAuth)
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
            setLoading(false);
        } else {

            oktaAuth.token.getUserInfo().then(info => {
                console.log(info)
                setUserInfo(info);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [authState, oktaAuth]);



    useEffect(() => {
        async function loadUser() {
            if (userInfo && userInfo.email) {
                try {
                    const response = await axios.get(`/api/users/byemail`, {
                        params:
                        {
                            email: userInfo.email
                        }
                    });
                    console.log("Get user details")
                    console.log(response.data.content);
                    const userDataArray = response.data[0];
                    const userModel = mapArrayToUserModel(userDataArray);
                    setUser(userModel);
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        loadUser();
    }, [userInfo]);



    useEffect(() => {
        async function loadBookings() {
            if (userInfo && userInfo.email && authState?.accessToken) {
                try {

                    const apiResponse = await axios.get(`/api/vehicleBookings/v2/getuserbookings?email=${userInfo.email}`, {
                        responseType: 'json',
                        headers:
                        {
                            Authorization: `Bearer ${authState.accessToken?.accessToken}`
                        }
                    });

                    const data = apiResponse.data;
                    console.log("User booking data:", data);
                    const response = data.map((item: any) => new UserVehicleBookingsModel(
                    item.vehicleBookingId ,
                    item.vehicleName ,
                    item.vehicleDescription ,
                    item.vehicleType ,
                    item.vehicleId ,
                    item.dayRate ,
                    item.locationId ,
                    item.locationName ,
                    item.locationDescription,
                    item.locationAddress,
                    item.locationCity ,
                    item.locationState ,
                    item.locationCountry,
                    item.locationZip ,
                    item.fromDate ,
                    item.toDate ,
                    item.totalFare,
                    item.userEmail
                    ));


    //const response = await fetchUserBookingData(userInfo.email);



    setBookings(response);

    console.log("Booking IDs:", (bookings));


} catch (error) {
    console.error('Error fetching Booking details:', error);
} finally {
    setLoading(false);
}
            }
        }

loadBookings();
    }, [userInfo]);

const mapArrayToUserModel = (data: any[]): UserModel => {
    const [user_id, user_first_name, user_last_name, user_driver_license_num, user_address, user_email] = data;
    return new UserModel(user_id, user_first_name, user_last_name, user_driver_license_num, user_address, user_email);
};

if (loading) {
    return <SpinnerLoading />;
}



return (
    <div className="container mt-5">
        <h2>User Bookings</h2>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Location</th>
                    <th>City</th>
                    
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Total Fare</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map(booking => (
                    <tr key={booking.vehicleBookingId}>
                        <td>{booking.vehicleBookingId}</td>
                        <td>{booking.vehicleName} </td>
                        <td>{booking.locationName}</td>
                        <td>{booking.locationCity}</td>
                        <td>{formatDate(booking.fromDate)}</td>
                        <td>{formatDate(booking.toDate)}</td>
                        <td>{booking.totalFare}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default UserBookingsV2;