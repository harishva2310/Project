import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import LocationModel from '../../model/LocationModel';
import VehicleModel from '../../model/VehicleModel';
import VehicleLocationModel from '../../model/VehicleLocationModel';
import { fetchLocationData } from '../../service/LocationService';
import { fetchVehicleDataByID } from '../../service/FetchVehicleByID';
import { fetchLocationDataByID } from '../../service/FetchLocationByID';
import { fetchVehicleLocationDataByID } from '../../service/FetchVehicleLocationByID';
import { SpinnerLoading } from '../../util/SpinnerLoading';
import { AvailableVehicleResponse } from './components/AvailableVehicleResponse';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import _ from "lodash";



const SearchVehicle = () => {

    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [selectedlocations, setSelectedLocations] = useState<LocationModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [fromTime, setFromTime] = useState<string>('00:00');
    const [toTime, setToTime] = useState<string>('23:59');
    const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicleResponse[]>([]);
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [vehicleLocations, setVehicleLocations] = useState<VehicleLocationModel[]>([]);
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRate, setTotalRate] = useState<number[]>([]);

    const navigate = useNavigate();

    const calculateTotalRate = (dayRate: number, fromDate: string, toDate: string) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        console.log(from);
        console.log(to);
        const timeDifference = to.getTime() - from.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate number of days
        const total = daysDifference * dayRate;
        setTotalRate(prevRates => [...prevRates, total]);
    };


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
        console.log("Total Pages in result:", totalPages);
    }, [totalPages]);

    useEffect(() => {
        if (selectedCity !== '' && selectedCountry !== '' && fromDate !== '' && toDate !== '' && fromTime !== '' && toTime !== '') {
            handleSearch(page);
        }
    }, [selectedCity, selectedCountry, fromDate, toDate, fromTime, toTime]);

    

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
        return arr.filter((value, index, self) => self.indexOf(value) === index);
    };

    const handleSearch = useCallback(_.debounce(async (page: number = 0) => {
        if (selectedCity !== '' && selectedCountry !== '' && fromDate !== '' && toDate !== '' && fromTime !== '' && toTime !== '') {
            console.log("Selected city:", selectedCity)
            setLoading(true);
            setTotalPages(0);
            setVehicles([]);
            setSelectedLocations([]);
            setVehicleLocations([]);
            setTotalRate([]);
            try {
                const fromDateTime = formatDateTime(fromDate, fromTime);
                const toDateTime = formatDateTime(toDate, toTime);
                const response = await axios.get(`/api/vehicles/availablevehicles`, {
                    params: {
                        fromdate: fromDateTime,
                        todate: toDateTime,
                        city: selectedCity,
                        country: selectedCountry,
                        page: page,
                        size: size
                    }
                });
                setAvailableVehicles(response.data.content);
                setTotalPages(response.data.page.totalPages);

                loadVehicleData(response.data.content);
                
            } catch (error) {
                console.error('Error fetching available vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

    }, 300), [selectedCity, selectedCountry, fromDate, toDate, fromTime, toTime]); // 300ms debounce delay

    const loadVehicleData = async (availableVehicles: AvailableVehicleResponse[]) => {
        setVehicles([]);
        setSelectedLocations([]);
        setVehicleLocations([]);
        setTotalRate([]);
        for (const vehicle of availableVehicles) {
            const [vehicleId, , vehicleLocationId, locationId] = vehicle;
            console.log("Available Vehicles Line 158: ",vehicle)
            try {
                const vehicleData = await fetchVehicleDataByID(vehicleId);
                const fromDateTime = formatDateTime(fromDate, fromTime);
                const toDateTime = formatDateTime(toDate, toTime);

                setVehicles(prevVehicles => [...prevVehicles, vehicleData]);


                const locationData = await fetchLocationDataByID(locationId);
                setSelectedLocations(prevLocations => [...prevLocations, locationData]);
                const vehicleLocationData = await fetchVehicleLocationDataByID(vehicleLocationId);
                setVehicleLocations(prevVehicleLocations => [...prevVehicleLocations, vehicleLocationData])
                calculateTotalRate(vehicleData.day_rate, fromDateTime, toDateTime);
            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        }
    };

    if (loading) {
        return <SpinnerLoading />;
    }
    
    const handlePageClick = (pageNumber: number) => {
        setPage(pageNumber);
        handleSearch(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(
                <ul className="pagination">


                    <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
                        <a
                            className="page-link"
                            onClick={() => handlePageClick(i)}

                        >
                            {i + 1}
                        </a>
                    </li>


                </ul>

            );
        }
        return pageNumbers;
    };


    const uniqueCities = getUniqueValues(locations.map(location => location.location_city));
    const uniqueCountries = getUniqueValues(locations.map(location => location.location_country));

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
            handleSearch(page + 1); // Ensure handleSearch updates with new page
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
            handleSearch(page - 1);
        }
    };

    const handleSearchClick = () => {
        handleSearch(page);
    };


    const handleViewDetails = (availableVehicles: AvailableVehicleResponse) => {
        const vehicleDetails = {
            vehicle_id: availableVehicles[0],
            location_id: availableVehicles[3],
            vehicle_location_id: availableVehicles[2],
            from_date: formatDateTime(fromDate, fromTime),
            to_date: formatDateTime(toDate, toTime),

        };

        navigate('/checkout', { state: vehicleDetails });
    };



    return (
        <>
            <div>
                <div className='container'>
                    <div>
                        <div className='row mt-5'>
                            <div className='col-md-2'>
                                <div className='mb-2'>
                                    <label htmlFor="city" className="form-label">City</label>
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
                            <div className='col-md-2'>
                                <div className="mb-2">
                                    <label htmlFor="country" className="form-label">Country</label>
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
                            <div className='col-md-2'>
                                <div className="mb-2">
                                    <label htmlFor="fromDate" className="form-label">From</label>
                                    <input type="date" id="fromDate" className="form-control" required value={fromDate} onChange={handleFromDateChange} />
                                </div>
                            </div>
                            <div className='col-md-2'>
                                <div className="mb-2">
                                    <label htmlFor="toDate" className="form-label">To</label>
                                    <input type="date" id="toDate" className="form-control" required value={toDate} onChange={handleToDateChange} />
                                </div>
                            </div>
                            <div className='col-md-2'>
                                <div className="mb-2">
                                    <label htmlFor="fromTime" className="form-label">From Time</label>
                                    <input type="time" id="fromTime" className="form-control" value={fromTime} onChange={handleFromTimeChange} required min="09:00" max="17:00" />
                                </div>
                            </div>
                            <div className='col-md-2'>
                                <div className="mb-2">
                                    <label htmlFor="toTime" className="form-label">To Time</label>
                                    <input type="time" id="toTime" className="form-control" value={toTime} onChange={handleToTimeChange} required min="09:00" max="17:00" />
                                </div>
                            </div>
                            <div className='col-12 text-center'>
                                <button type="submit" className="btn btn-primary" onClick={handleSearchClick}>Search</button>
                            </div>
                        </div>
                    </div>
                </div>

                <section data-bs-version="5.1" className="features9 cid-uhChHy94BR mbr-parallax-background" id="features9-0">




                    <div className="mbr-overlay" style={{ opacity: 0.5, backgroundColor: 'rgb(190, 211, 249)' }}>
                    </div>

                    <div className="container">
                        {availableVehicles.length > 0 ? (
                            <>
                                {vehicles.map((vehicle, index) => (
                                    <div className="item features-image" key={vehicle.vehicle_id}>
                                        <div className="item-wrapper">
                                            <div className="row align-items-center">
                                                <div className="col-12 col-md-4">
                                                    <div className="image-wrapper">
                                                        <img src={`data:image/jpg;base64,${vehicle.img}`} alt="..." />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md">
                                                    <div className="card-box">
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <h6 className="card-title mbr-fonts-style display-5">
                                                                    <strong> {vehicle.vehicle_name} </strong>
                                                                </h6>
                                                                <p className="mbr-text mbr-fonts-style display-7">
                                                                    {vehicle.vehicle_description}
                                                                </p>
                                                                <p className="mbr-text mbr-fonts-style display-7">
                                                                    Rate per day: ${vehicle.day_rate}
                                                                </p>
                                                            </div>
                                                            <div className="col-md-auto">
                                                                <p className="price mbr-fonts-style display-2">${totalRate[index]}</p>
                                                                <div className="mbr-section-btn"><a
                                                                    className="btn btn-primary display-4" onClick={() => handleViewDetails(availableVehicles[index])}>
                                                                    View Details
                                                                </a></div>
                                                            </div>
                                                            <div></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="d-flex justify-content-center mt-5 mb-5">
                                    <ul className="pagination pagination-lg justify-content-end">
                                        <li className="page-item">
                                            <a className="page-link" onClick={handlePreviousPage}>Previous</a>
                                        </li>

                                        {renderPageNumbers()}
                                        
                                        <li className="page-item">
                                            <a className="page-link" onClick={handleNextPage}>Next</a>
                                        </li>

                                    </ul>
                                </div>
                            </>
                        ) : (

                            <div className="mbr-section-head">
                                <h4 className="mbr-section-title mbr-fonts-style align-center mb-5 display-2">
                                    <strong>Select the location and timings to see all available Vehicles</strong></h4>

                            </div>

                        )}

                    </div>
                </section>



            </div>
        </>
    );
}

export default SearchVehicle;


