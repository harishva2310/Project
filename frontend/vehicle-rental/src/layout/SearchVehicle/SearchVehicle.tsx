import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VehicleModel from '../../model/VehicleModel';
import LocationModel from '../../model/LocationModel';
import { fetchLocationData } from '../../service/LocationService';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { AvailableVehicleResponse } from './components/AvailableVehicleResponse';
const SearchVehicle: React.FC = () => {
    const apiUrl = process.env.REACT_APP_API;
    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [fromTime, setFromTime] = useState<string>('00:00');
    const [toTime, setToTime] = useState<string>('23:59');
    const [vehicles, setVehicles] = useState<AvailableVehicleResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    

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



    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
    };

    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(event.target.value);
    };

    const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(event.target.value);
    };

    const handleFromTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromTime(event.target.value);
    };

    const handleToTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToTime(event.target.value);
    };

    const formatDateTime = (date: string, time: string) => {
        return `${date}T${time}:00`;
    };


    const getUniqueValues = (arr: string[]): string[] => {
        return arr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    };


    const handleSearch = async () => {
        try {
            const fromDateTime = formatDateTime(fromDate, fromTime);
            const toDateTime = formatDateTime(toDate, toTime);
            const response = await axios.get(`${apiUrl}/vehicles/availablevehicles`, {
                params: {
                    fromdate: fromDateTime,
                    todate: toDateTime,
                    city: selectedCity,
                    country: selectedCountry,
                    page: page,
                    size: size
                }
            });
            setVehicles(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching available vehicles:', error);
        }
    };

    // Filter unique cities
    const uniqueCities = getUniqueValues(locations.map(location => location.location_city));

    // Filter unique states


    // Filter unique countries
    const uniqueCountries = getUniqueValues(locations.map(location => location.location_country));


    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
            handleSearch();
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
            handleSearch();
        }
    };


    return (
        <div>
            <div className='container'>
                <div>

                    <div className='row mt-5'>
                        <div className='col-md-6'>
                            <div className='d-flex mb-3'>
                                <select id="city" value={selectedCity} onChange={handleCityChange} className="form-select" required>
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
                                <select id="country" value={selectedCountry} onChange={handleCountryChange} className="form-select" required>
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
                                <input type="date" id="fromDate" className="form-control" required value={fromDate} onChange={handleFromDateChange} />
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="toDate" className="form-label">To</label>
                                <input type="date" id="toDate" className="form-control" required value={toDate} onChange={handleToDateChange}/>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="fromTime" className="form-label">To Time</label>
                                <input type="time" id="fromTime" className="form-control" value={fromTime} onChange={handleFromTimeChange} required min="09:00:00" max="17:00:00"/>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className="mb-3">
                                <label htmlFor="toTime" className="form-label">To Time</label>
                                <input type="time" id="toTime" className="form-control" value={toTime} onChange={handleToTimeChange} required min="09:00:00" max="17:00:00"/>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className='col-12 text-center'>
                            <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                        </div>


                        {/* Display Results */}
                        <div className='row mt-5'>
                            <div className='col-12'>
                                {vehicles.length > 0 ? (
                                    <div>
                                        <h3>Available Vehicles</h3>
                                        <ul>
                                            {vehicles.map((vehicle,index) => (
                                                <li key={index}>{vehicle[1]}</li>
                                            ))}
                                        </ul>
                                        <div className="pagination">
                                            <button className="btn btn-secondary" onClick={handlePreviousPage} disabled={page === 0}>
                                                Previous
                                            </button>
                                            <span> Page {page + 1} of {totalPages} </span>
                                            <button className="btn btn-secondary" onClick={handleNextPage} disabled={page === totalPages - 1}>
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No available vehicles found.</p>
                                )}
                            </div>
                        </div>




                    </div>

                </div>
            </div>
        </div>
    );

}

export default SearchVehicle;