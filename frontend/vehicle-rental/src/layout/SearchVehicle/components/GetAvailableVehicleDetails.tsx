import { AvailableVehicleResponse } from "./AvailableVehicleResponse";
import LocationModel from "../../../model/LocationModel";
import VehicleLocationModel from "../../../model/VehicleLocationModel";
import VehicleModel from "../../../model/VehicleModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchVehicleDataByID } from "../../../service/FetchVehicleByID";
import { SpinnerLoading } from "../../../util/SpinnerLoading";
import { fetchLocationDataByID } from "../../../service/FetchLocationByID";
import { fetchVehicleLocationDataByID } from "../../../service/FetchVehicleLocationByID";
import { Link } from "react-router-dom";


export const ProcessVehicleData = (availableVehicle: AvailableVehicleResponse) => {
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [vehiclelocations, setVehicleLocations] = useState<VehicleLocationModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [vehicle_id, vehicle_name, location_id, vehicle_location_id] = availableVehicle;


    const apiUrl = process.env.REACT_APP_API;
    if (!apiUrl) {
        throw new Error('REACT_APP_API environment variable is not set');
    }
    else {
        console.log(apiUrl);
    }
    useEffect(() => {
        async function loadVehicles() {
            try {
                const data = await fetchVehicleDataByID(vehicle_id);
                setVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicles();
    }, []);

    if (loading) {
        return <SpinnerLoading />;
    }

    useEffect(() => {
        async function loadLocations() {
            try {
                const data = await fetchLocationDataByID(location_id);
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        }

        loadLocations();
    }, []);

    if (loading) {
        return <SpinnerLoading />;
    }

    useEffect(() => {
        async function loadVehicleLocations() {
            try {
                const data = await fetchVehicleLocationDataByID(vehicle_location_id);
                setVehicleLocations(data);
            } catch (error) {
                console.error('Error fetching Vehicle locations:', error);
            } finally {
                setLoading(false);
            }
        }

        loadVehicleLocations();
    }, []);

    return (
        <>
        {vehicles.map((vehicle) => (
            <div className="card mb-3" >
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={`data:image/jpg;base64,${vehicle.img}`} className="img-fluid rounded-start" alt="..." />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{vehicle.vehicle_name}</h5>
                            <p className="card-text">{vehicle.vehicle_description}</p>
                            {locations.map((location) => (
                                <>
                                <h4 className="card-title">Location Details:</h4>
                                <p className="card-text">{location.location_name}</p>
                                <p className="card-text">{location.location_address}</p>
                                <p className="card-text">{location.location_city}</p>
                                <p className="card-text">{location.location_zip}</p>
                                </>
                            ))}
                            <Link className='btn btn-md main-color text-white' to={`/checkout`}>
                        View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        </>
    );



}

