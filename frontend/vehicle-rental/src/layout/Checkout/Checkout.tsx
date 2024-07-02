import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import { fetchLocationDataByID } from '../../service/FetchLocationByID';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { fetchVehicleDataByID } from '../../service/FetchVehicleByID';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import UserModel from '../../model/UserModel';
import { userResponse } from './components/userResponse';
import axios from 'axios';
export interface UserInfo {
    name?: string;
    email?: string;
    // Add any other claims you expect to receive
}

const Checkout = () => {
    const defaultApiUrl = "http://vehicle-rental-service:8080";
    const apiUrl = process.env.REACT_APP_API || defaultApiUrl;
    const location = useLocation();
    const vehicleDetails = location.state;
    const [locations, setLocations] = useState<LocationModel>();
    const [vehicles, setVehicles] = useState<VehicleModel>();
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRate, setTotalRate] = useState<number>(0);
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const formData = new FormData();
    const navigate = useNavigate();

    const calculateTotalRate = (dayRate: number, fromDate: string, toDate: string) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        console.log(from);
        console.log(to);
        const timeDifference = to.getTime() - from.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate number of days
        const total = daysDifference * dayRate;
        setTotalRate(total);
    };

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
        } else {

            oktaAuth.token.getUserInfo().then(info => {
                console.log(info)
                setUserInfo(info);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [authState, oktaAuth]);



    useEffect(() => {
        async function loadLocations() {
            try {
                const data = await fetchLocationDataByID(vehicleDetails.location_id);
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        }

        loadLocations();
    }, []);

    useEffect(() => {
        async function loadVehicles() {
            try {
                const data = await fetchVehicleDataByID(vehicleDetails.vehicle_id);
                setVehicles(data);
                calculateTotalRate(data.day_rate, vehicleDetails.from_date, vehicleDetails.to_date);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, [vehicleDetails.vehicle_id]);


    useEffect(() => {
        async function loadUser() {
            if (userInfo && userInfo.email) {
                try {
                    const response = await axios.get(`/users/byemail`, {
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

    if (loading) {
        return <SpinnerLoading />;
    }

    const mapArrayToUserModel = (data: any[]): UserModel => {
        const [user_id, user_first_name, user_last_name, user_driver_license_num, user_address, user_email] = data;
        return new UserModel(user_id, user_first_name, user_last_name, user_driver_license_num, user_address, user_email);
    };

    const handlePayLaterClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmBooking = async () => {
        setShowModal(false);
        try {
            console.log("Vehicle ID:", vehicleDetails.vehicle_id)
            formData.append('vehicle_id', vehicleDetails.vehicle_id);
            formData.append('location_id', vehicleDetails.location_id);
            formData.append('vehicle_location_id',vehicleDetails.vehicle_location_id)
            formData.append('total_fare',totalRate.toString())
            formData.append('from_date', vehicleDetails.from_date)
            formData.append('to_date', vehicleDetails.to_date)
            if (userInfo?.email) {
                formData.append('user_email', userInfo.email);
              }

            const response = await axios.post(`/api/vehicleBookings`, formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                  },
            }
        
        
        );
            console.log('Booking confirmed:', response.data);
            // Handle any further logic or state updates after successful booking
            navigate('/myBookings');
            
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };


    return (
        /*<>
        <div>
            <h1>Checkout</h1>
            <p>Vehicle ID: {vehicleDetails.vehicle_id}</p>
            <p>Location ID: {vehicleDetails.location_id}</p>
            <p>Vehicle Location ID: {vehicleDetails.vehicle_location_id}</p>
            <p>From Date: {vehicleDetails.from_date}</p>
            <p>To Date: {vehicleDetails.to_date}</p>
            
            
        </div>
        </>*/
        <div className="px-4 py-5 my-5 text-center">
            <img className="d-block mx-auto mb-4" src={`data:image/jpg;base64,${vehicles?.img}`} alt="" width="512" height="300" />
            <h1 className="display-5 fw-bold text-body-emphasis">{vehicles?.vehicle_name}</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4">{vehicles?.vehicle_description}</p>
                <h1 className="display-5 fw-bold text-body-emphasis">Renter details</h1>
                {userInfo && (
                    <div>
                        <p className="lead mb-4">User: {userInfo.name}</p>
                        <p className="lead mb-4">Email: {userInfo.email}</p>
                        <p className="lead mb-4">Address: {user?.user_address}</p>


                    </div>
                )}
                <h3 className="display-5 fw-bold text-body-emphasis">Location Pickup/Drop Details</h3>
                <p className="lead mb-4">{locations?.location_name}</p>
                <p className="lead mb-4">{locations?.location_address}</p>
                <p className="lead mb-4">{locations?.location_city}</p>
                <p className="lead mb-4">{locations?.location_state}</p>
                <p className="lead mb-4">{locations?.location_country}</p>
                <p className="lead mb-4">{locations?.location_zip}</p>
                <h3 className="display-5 fw-bold text-body-emphasis">Fare Details</h3>
                <p className="lead mb-4">Rate per day: {vehicles?.day_rate} USD</p>
                <p className="lead mb-4">Total Fare: {totalRate} USD</p>
                <p className="lead mb-4">From : {formatDate(vehicleDetails.from_date)} </p>
                <p className="lead mb-4">To : {formatDate(vehicleDetails.to_date)} </p>


                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button type="button" className="btn btn-primary btn-lg px-4 gap-3">Pay Now</button>
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={handlePayLaterClick}>Pay Later</button>
                </div>


            </div>

            {showModal && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Booking</h5>
                                <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Do you want to finish the booking?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleConfirmBooking}>Confirm</button>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
};

export default Checkout;