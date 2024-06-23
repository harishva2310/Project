import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import { fetchLocationDataByID } from '../../service/FetchLocationByID';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { fetchVehicleDataByID } from '../../service/FetchVehicleByID';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';

export interface UserInfo {
    name?: string;
    email?: string;
    // Add any other claims you expect to receive
}

const Checkout = () => {
    const location = useLocation();
    const vehicleDetails = location.state;
    const [locations, setLocations] = useState<LocationModel>();
    const [vehicles, setVehicles] = useState<VehicleModel>();
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRate, setTotalRate] = useState<number>(0);
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);

    

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

    if (loading) {
        return <SpinnerLoading />;
    }

    

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
                <p className="lead mb-4">Total Rate: {totalRate} USD</p>
                <p className="lead mb-4">From : {formatDate(vehicleDetails.from_date)} </p>
                <p className="lead mb-4">To : {formatDate(vehicleDetails.to_date)} </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <button type="button" className="btn btn-primary btn-lg px-4 gap-3">Pay Now</button>
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4">Pay Later</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;