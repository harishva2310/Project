import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleModel from '../../model/VehicleModel';
import LocationModel from '../../model/LocationModel';
import { fetchLocationData } from '../../service/LocationService';
import { SpinnerLoading } from '../../util/SpinnerLoading';

const SearchVehicle: React.FC = () => {
    const apiUrl = process.env.REACT_APP_API;
    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function loadLocations() {
            try {
                const data = await fetchLocationData();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

        loadLocations();
    }, []);

    if (loading) {
        return <SpinnerLoading />;
    }

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value);
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedState(event.target.value);
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };


    const getUniqueValues = (arr: string[]): string[] => {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    };

    // Filter unique cities
    const uniqueCities = getUniqueValues(locations.map(location => location.location_city));

    // Filter unique states
    const uniqueStates = getUniqueValues(locations.map(location => location.location_state));

    // Filter unique countries
    const uniqueCountries = getUniqueValues(locations.map(location => location.location_country));

    return (
        <div>
            <div className='container'>
                <div>

                    <div className='row mt-5'>
                        <div className='col-md-6'>
                            <div className='d-flex mb-3'>
                                <select id="city" value={selectedCity} onChange={handleCityChange} className="form-select">
                                    <option value="">Select a city</option>
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        

                        <div className='col-md-6'>
                            <div className="mb-3">
                                <select id="country" value={selectedCountry} onChange={handleCountryChange} className="form-select">
                                    <option value="">Select Country</option>
                                    {uniqueCountries.map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date Input Fields */}
                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="fromDate" className="form-label">From</label>
                                <input type="date" id="fromDate" className="form-control" />
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="toDate" className="form-label">To</label>
                                <input type="date" id="toDate" className="form-control" />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className='col-1 text-center'>
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );

}

export default SearchVehicle;