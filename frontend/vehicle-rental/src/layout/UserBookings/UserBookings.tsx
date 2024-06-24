import { useEffect, useState } from "react";
import LocationModel from "../../model/LocationModel";
import VehicleModel from "../../model/VehicleModel";
import { useOktaAuth } from "@okta/okta-react";
import { CustomUserClaims, UserClaims } from "@okta/okta-auth-js";
import UserModel from "../../model/UserModel";
import { fetchLocationDataByID } from "../../service/FetchLocationByID";
import VehicleBookingModel from "../../model/VehicleBookingModel";
import axios from "axios";
import { fetchUserBookingData } from "../../service/FetchUserBookingByEmail";
import { fetchVehicleDataByID } from "../../service/FetchVehicleByID";
import { SpinnerLoading } from "../../util/SpinnerLoading";


const UserBookings = () => {
    const apiUrl = process.env.REACT_APP_API;
    const [locations, setLocations] = useState<Record<number, LocationModel>>({});
    const [vehicles, setVehicles] = useState<Record<number, VehicleModel>>({});
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<VehicleBookingModel[]>([]);


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
                    const response = await axios.get(`${apiUrl}/users/byemail`, {
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
            if (userInfo && userInfo.email) {
                try {
                    const response = await fetchUserBookingData(userInfo.email);
                    setBookings(response);
                    console.log("Booking IDs:", (bookings));
                    console.log("Locations in booking:", response.map(booking => booking.location_id));
                    console.log("Vehicles in booking:", response.map(booking => booking.vehicle_id));
                    const locationPromises = response.map(booking => fetchLocationDataByID(booking.location_id));
                    const vehiclePromises = response.map(booking => fetchVehicleDataByID(booking.vehicle_id));

                    const locations = await Promise.all(locationPromises);
                    const vehicles = await Promise.all(vehiclePromises);

                    console.log("Locations fetched:", locations);
                    console.log("Vehicles fetched:", vehicles);

                    const locationMap: Record<number, LocationModel> = {};
                    locations.forEach(location => {
                        locationMap[location.location_id] = location;
                    });

                    const vehicleMap: Record<number, VehicleModel> = {};
                    vehicles.forEach(vehicle => {
                        vehicleMap[vehicle.vehicle_id] = vehicle;
                    });

                    setLocations(locationMap);
                    setVehicles(vehicleMap);

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
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Total Fare</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.vehicle_booking_id}>
                            <td>{booking.vehicle_booking_id}</td>
                            <td>{vehicles[booking.vehicle_id]?.vehicle_name} </td>
                            <td>{locations[booking.location_id]?.location_name}</td>
                            <td>{formatDate(booking.from_date)}</td>
                            <td>{formatDate(booking.to_date)}</td>
                            <td>{booking.total_fare}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserBookings;