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
import VehicleTypeModel from '../../model/VehicleTypeModel';
import { fetchVehicleTypeData } from '../../service/FetchVehicleType';
import AvailableVehicleV3 from './components/AvailableVehicleV3';

const SearchVehicleV3 = () => {
    const [locations, setLocations] = useState<LocationModel[]>([]);
    const [selectedlocations, setSelectedLocations] = useState<LocationModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [fromTime, setFromTime] = useState<string>('00:00');
    const [toTime, setToTime] = useState<string>('23:59');
    const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicleV3[]>([]);
    const [availableVehiclesFiltered, setAvailableVehiclesFiltered] = useState<AvailableVehicleV3[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeModel[]>([]);
    const [vehicles, setVehicles] = useState<VehicleModel[]>([]);
    const [vehicleLocations, setVehicleLocations] = useState<VehicleLocationModel[]>([]);
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRate, setTotalRate] = useState<number[]>([]);
    const [sortOption, setSortOption] = useState<string>('');
    const [filterOption, setFilterOption] = useState<string>('');
    const [filteredVehicles, setFilteredVehicles] = useState<VehicleModel[]>([]);
    const sysDate = new Date();

    const navigate = useNavigate();

    const calculateTotalRates = (vehicles: AvailableVehicleV3[], fromDate: string, toDate: string) => {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const timeDifference = to.getTime() - from.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const rates = vehicles.map(vehicle => daysDifference * vehicle.dayRate);
        setTotalRate(rates);
    };

    useEffect(() => {
        async function loadLocations() {
            try {
                const data = await fetchLocationData();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                
            }
        }

        loadLocations();
    }, []);

    useEffect(() => {
        async function loadVehicleTypes() {
            try {
                const data = await fetchVehicleTypeData();
                setVehicleTypes(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                
            }
        }

        loadVehicleTypes();
    }, []);


    useEffect(() => {
        console.log("Total Pages in result:", totalPages);
    }, [totalPages]);

    useEffect(() => {
        if (selectedCity !== '' && selectedCountry !== '' && fromDate !== '' && toDate !== '' && fromTime !== '' && toTime !== '' && (filterOption === '' || filterOption !== '')) {
            handleSearch(page);

        }
    }, [selectedCity, selectedCountry, fromDate, toDate, fromTime, toTime]);

    useEffect(() => {
        calculateTotalRates(availableVehiclesFiltered, fromDateTime, toDateTime);
    }, [availableVehiclesFiltered]);


    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value);

    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);

    };

    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(event.target.value);
        if (selectedDate >= sysDate) {
            setFromDate(event.target.value);
            setToDate(event.target.value);
        }
        else
        {
            const sysDateStr = sysDate.toISOString().split('T')[0];
            setFromDate(sysDateStr);
            setToDate(sysDateStr);
        }
    };

    const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value >= fromDate) {
            setToDate(event.target.value);
        }
        else {
            setToDate(fromDate);
        }


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

    const fromDateTime = formatDateTime(fromDate, fromTime);
    const toDateTime = formatDateTime(toDate, toTime);

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

                const response = await axios.get(`${process.env.REACT_APP_API}/api/vehicles/v3/availablevehicles`, {
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
                setAvailableVehiclesFiltered(response.data.content);
                setTotalPages(response.data.page.totalPages);
                calculateTotalRates(response.data.content, fromDateTime, toDateTime);


            } catch (error) {
                console.error('Error fetching available vehicles:', error);
            } finally {
                setLoading(false);
            }
        }

    }, 300), [selectedCity, selectedCountry, fromDate, toDate, fromTime, toTime]); // 300ms debounce delay

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
        sortVehicles(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterOption(event.target.value);
        console.log("Select filter option:", filterOption)
        filterVehicles(event.target.value);
    };


    const sortVehicles = (option: string) => {
        const sortedVehicles = [...availableVehiclesFiltered].sort((a, b) => {
            if (option === 'asc') {
                return a.dayRate - b.dayRate;
            } else if (option === 'desc') {
                return b.dayRate - a.dayRate;
            } else {
                return 0;
            }
        });

        setAvailableVehiclesFiltered(sortedVehicles);

    };

    const filterVehicles = (option: string) => {
        if (option === '') {
            setAvailableVehiclesFiltered(availableVehicles);
        } else {
            const filtered = availableVehicles.filter(vehicle => vehicle.vehicleType === option);
            setAvailableVehiclesFiltered(filtered);
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
    const uniqueVehicleTypes = getUniqueValues(vehicleTypes.map(vehicle => vehicle.vehicle_type));

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


    const handleViewDetails = (availableVehicles: AvailableVehicleV3) => {
        const vehicleDetails = {
            vehicle_id: availableVehicles.vehicleId,
            location_id: availableVehicles.locationId,
            vehicle_location_id: availableVehicles.vehicleLocationId,
            from_date: formatDateTime(fromDate, fromTime),
            to_date: formatDateTime(toDate, toTime),

        };

        navigate('/checkout', { state: vehicleDetails });
    };

    return (
        <>

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

                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row mb-4">
                    <div className="col-md-4">
                        <label htmlFor="sort" className="form-label">Sort by Fare</label>
                        <select id="sort" value={sortOption} onChange={handleSortChange} className="form-select">

                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="filter" className="form-label">Filter by Type</label>
                        <select id="filter" value={filterOption} onChange={handleFilterChange} className="form-select">
                            <option value="">All types</option>
                            {uniqueVehicleTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='col-12 text-center'>
                        <button type="submit" className="btn btn-primary" onClick={handleSearchClick}>Search</button>
                    </div>
                </div>
            </div>



            <section data-bs-version="5.1" className="features9 cid-uhChHy94BR mbr-parallax-background" id="features9-0">




                <div className="mbr-overlay" style={{ opacity: 0.5, backgroundColor: 'rgb(190, 211, 249)' }}>
                </div>

                <div className="container">
                    {availableVehiclesFiltered.length > 0 ? (
                        <>
                            {availableVehiclesFiltered.map((vehicle, index) => (
                                <div className="item features-image" key={vehicle.vehicleId}>
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
                                                                <strong> {vehicle.vehicleName} </strong>
                                                            </h6>
                                                            <p className="mbr-text mbr-fonts-style display-7">

                                                                {vehicle.vehicleDescription}
                                                            </p>
                                                            <p className="mbr-text mbr-fonts-style display-7">

                                                                {vehicle.vehicleType}
                                                            </p>
                                                            <p className="mbr-text mbr-fonts-style display-7">
                                                                Rate per day: ${vehicle.dayRate}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-auto">
                                                            <p className="price mbr-fonts-style display-2">${totalRate[index]}</p>
                                                            <div className="mbr-section-btn"><a
                                                                className="btn btn-primary display-4" onClick={() => handleViewDetails(availableVehiclesFiltered[index])}>
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

        </>
    );

}

export default SearchVehicleV3;