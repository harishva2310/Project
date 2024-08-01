
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import { fetchLocationDataByID } from '../../service/FetchLocationByID';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { fetchVehicleDataByID } from '../../service/FetchVehicleByID';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import axios, { AxiosError } from 'axios';

export interface UserInfo {
    name?: string;
    email?: string;
    // Add any other claims you expect to receive
}
const ConfirmationPage = () => {
    const location = useLocation();
    const bookingDetails = location.state;
    const [locations, setLocations] = useState<LocationModel>();
    const [vehicles, setVehicles] = useState<VehicleModel>();
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRate, setTotalRate] = useState<number>(0);
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const formatDate = (isoDateString: string): string => {
        const date = new Date(isoDateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' } as const;
        return date.toLocaleDateString('en-US', options);
    };

    const MJ_APIKEY_PUBLIC="50b59ad087f0ed770ccbbcc5acc7d519";
    const MJ_APIKEY_PRIVATE="9f57b1ad4d3af0e054a82b44a61d3943";
    
    const mailjetApiUrl = 'https://api.mailjet.com/v3.1/send';
    const email_body={
        "Messages": [
            {
                "From": {
                    "Email": "harish.va1910@gmail.com",
                    "Name": "Vehicle Rental Inc"
                },
                "To": [
                    {
                        "Email": userInfo?.email,
                        "Name": userInfo?.name
                    }
                ],
                "TemplateID": 6183517,
                "TemplateLanguage": true,
                "Subject": "Booking Details",
                "Variables": {
                    "firstname": userInfo?.name,
                    "vehicle_name": vehicles?.vehicle_name,
                    "vehicle_type": vehicles?.vehicle_type,
                    "vehicle_description": vehicles?.vehicle_description,
                    "day_rate": vehicles?.day_rate,
                    "location_name": locations?.location_name,
                    "location_description": locations?.location_description,
                    "location_address": locations?.location_address,
                    "location_city": locations?.location_city,
                    "location_state": locations?.location_state,
                    "location_country": locations?.location_country,
                    "location_zip": locations?.location_zip,
                    "from": formatDate(bookingDetails.from_date),
                    "to": formatDate(bookingDetails.to_date),
                    "total": bookingDetails.total_fare
                }
            }
        ]
    }

    useEffect(() => {
        const config = {
          method: 'post',
          url: `${mailjetApiUrl}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${MJ_APIKEY_PUBLIC}:${MJ_APIKEY_PRIVATE}`)}`
          },
          data: JSON.stringify(email_body),
        };
        
      
        console.log(config); // Log the config object to verify the Authorization header
      
        const sendEmail = () => {
          axios(config)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error(error);
            });
        };
        sendEmail();
      }, [authState, oktaAuth, userInfo, vehicles, locations, bookingDetails]);
        

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
                const data = await fetchLocationDataByID(bookingDetails.location_id);
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
                const data = await fetchVehicleDataByID(bookingDetails.vehicle_id);
                setVehicles(data);

            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, [bookingDetails.vehicle_id]);

    if (loading) {
        return <SpinnerLoading />;
    }

    return (
        <>
            <section data-bs-version="5.1" className="header14 cid-sFzz5E692j" id="header14-1j">
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-12 col-md-6 image-wrapper">
                            <img src={`data:image/jpg;base64,${vehicles?.img}`} alt="..." />
                        </div>
                        <div className="col-12 col-md">
                            <div className="text-wrapper">
                                <h1 className="mbr-section-title mbr-fonts-style mb-3 display-2">
                                    <strong> {vehicles?.vehicle_name} </strong>
                                </h1>
                                <p className="mbr-text mbr-fonts-style display-7">{vehicles?.vehicle_description}</p>
                                <p className="mbr-fonts-style panel-text display-7">User: {userInfo?.name}</p>
                                <p className="mbr-fonts-style panel-text display-7">Email: {userInfo?.email}</p>
                                <p className="mbr-fonts-style panel-text display-7">Pickup and Drop Location: {locations?.location_name} </p>
                                <p className="mbr-fonts-style panel-text display-7"> Rate per day: {vehicles?.day_rate} USD</p>
                                <p className="mbr-fonts-style panel-text display-7">Total Fare: {bookingDetails.total_fare} USD</p>
                                <p className="mbr-fonts-style panel-text display-7">From : {formatDate(bookingDetails.from_date)} </p>
                                <p className="mbr-fonts-style panel-text display-7">To : {formatDate(bookingDetails.to_date)} </p>
                                <p className="mbr-fonts-style panel-text display-5">Your Booking has been confirmed! Click the button to go back to the homepage </p>
                                <Link className="btn btn-primary btn-lg px-4 gap-3" to="/home">Go to Home Page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

}
export default ConfirmationPage;