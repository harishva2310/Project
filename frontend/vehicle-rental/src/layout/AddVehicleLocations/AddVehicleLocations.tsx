import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOktaAuth } from '@okta/okta-react';
import { CustomUserClaims, UserClaims } from '@okta/okta-auth-js';
import { useNavigate } from 'react-router-dom';
import VehicleLocationModel from '../../model/VehicleLocationModel';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import { fetchLocationData } from '../../service/LocationService';
import { fetchVehicleData } from '../../service/FetchVehicle';
interface VehicleLocation {
    vehicle_id: number;
    location_id: number;
}

const AddVehicleLocations: React.FC = () => {

    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [vehicleLocation, setVehicleLocation] = useState<VehicleLocation>({
        vehicle_id: 0,
        location_id: 0,
    });

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
                const data = await fetchLocationData();
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
                const data = await fetchVehicleData();
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setVehicleLocation({ ...vehicleLocation, [event.target.name]: event.target.value });
    };

    const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLocation = locations.find(location => location.location_name === event.target.value);
        setSelectedLocation(event.target.value);
        if (selectedLocation) {
            setSelectedLocationId(selectedLocation.location_id);
            console.log(selectedLocationId)
        }
    };

    const handleVehicleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVehicle(event.target.value);
        const selectedVehicle = vehicles.find(vehicle => vehicle.vehicle_id.toString() === event.target.value);
        if (selectedVehicle) {
            setSelectedVehicleId(selectedVehicle.vehicle_id);
            console.log(selectedVehicleId)
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        if (selectedLocationId !== null && selectedVehicleId !== null && authState!== null) {
        formData.append('vehicle_id', selectedVehicleId.toString());
        formData.append('location_id', selectedLocationId.toString());
        //formData.append('userEmail',  userInfo?.email);
        try {
            const response = await axios.post(`/api/vehicleLocations?user_email=${userInfo?.email}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`
                },
            });
            console.log(response.data);
            // Handle success, e.g., clear form or show success message
            setAlertMessage({ type: 'success', message: 'Vehicle added successfully' });
            // Clear form
            setVehicleLocation({
                vehicle_id: 0,
                location_id: 0,
            });

        } catch (error) {
            console.error(error);
            setAlertMessage({ type: 'danger', message: 'Failed to add vehicle Location. Please try again.' });
            // Handle errors, e.g., display error message to user
        }
    } else {
        setAlertMessage({ type: 'danger', message: 'Please select a valid vehicle and location.' });
    }
    };

    if (authState?.accessToken?.claims.userType === undefined) {
        navigate("/home");
    }

    return (
        <section data-bs-version="5.1" className="form6 cid-uhCi1uTZNI" id="form6-7">

            <div className="mbr-overlay"></div>
            <div className="container">
                <div className="mbr-section-head">
                    <h3 className="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                        <strong>Add Vehicles to Location</strong>
                    </h3>
                    <h4 className="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
                        Register new vehicles to locations to allow customers to book the vehicle
                    </h4>
                </div>
                <div className="row justify-content-center mt-4">
                    <div className="col-lg-8 mx-auto mbr-form">
                        {alertMessage && (
                            <div className={`alert alert-${alertMessage.type}`} role="alert">
                                {alertMessage.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="mbr-form form-with-styler mx-auto" noValidate>

                            <div className="dragArea row">
                                <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="location">

                                    
                                    <select id="location" value={selectedLocation} onChange={handleLocationChange} className="form-select" required>
                                        <option value="">Select a location</option>
                                        {locations.map(location => (
                                            <option key={location.location_id} value={location.location_name}>
                                                {location.location_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 form-group mb-3" data-for="vehicle">

                                <select id="vehicle" value={selectedVehicle} onChange={handleVehicleChange} className="form-select" required>
                                        <option value="">Select a vehicle</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                                                {vehicle.vehicle_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-auto mbr-section-btn align-center">
                                    <button type="submit" className="btn btn-primary display-4">Add Vehicle to Location</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AddVehicleLocations;