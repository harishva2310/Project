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
            formData.append('vehicle_location_id', vehicleDetails.vehicle_location_id)
            formData.append('total_fare', totalRate.toString())
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
                                <div className="mbr-section-btn mt-3"><a className="btn btn-primary display-4"
                                    href="https://mobiri.se">Read More</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section data-bs-version="5.1" className="content17 cid-uhGpKnH4UK" id="content17-f">


    <div className="container">

        <div className="row justify-content-center">
            <div className="col-12 col-md-10">
                <div className="section-head align-center mb-4">
                    <h3 className="mbr-section-title mb-0 mbr-fonts-style display-2">
                        <strong>Booking Details</strong>
                    </h3>

                </div>

                <div id="bootstrap-toggle" className="toggle-panel accordionStyles tab-content">
                    <div className="card mb-3">
                        <div className="card-header" role="tab" id="headingOne">
                            <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse1_31" aria-expanded="false" aria-controls="collapse1">
                                <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>User Details</strong>
                                </h6>
                                <span className="sign mbr-iconfont mbri-arrow-down"></span>
                            </a>
                        </div>
                        <div id="collapse1_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne">
                            <div className="panel-body">
                                {userInfo && (
                                    <div className="panel-body">
                                        <p className="mbr-fonts-style panel-text display-7">User: {userInfo.name}</p>
                                        <p className="mbr-fonts-style panel-text display-7">Email: {userInfo.email}</p>
                                        <p className="mbr-fonts-style panel-text display-7">Address: {user?.user_address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header" role="tab" id="headingTwo">
                            <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse2_31" aria-expanded="false" aria-controls="collapse2">
                                <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>Location Pickup/Drop Details </strong>
                                </h6>
                                <span className="sign mbr-iconfont mbri-arrow-down"></span>
                            </a>

                        </div>
                        <div id="collapse2_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingTwo">
                            <div className="panel-body">
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_name} </p>
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_address}</p>
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_city}</p>
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_state}</p>
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_country}</p>
                                <p className="mbr-fonts-style panel-text display-7">{locations?.location_zip}</p>
                            </div>
                        </div>
                        <div id="collapse2_32" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingTwo">
                            <div className="panel-body">
                                <p className="mbr-fonts-style panel-text display-4"> Rate per day: {vehicles?.day_rate} USD</p>
                                <p className="mbr-fonts-style panel-text display-4">Total Fare: {totalRate} USD</p>
                                <p className="mbr-fonts-style panel-text display-4">From : {formatDate(vehicleDetails.from_date)} </p>
                                <p className="mbr-fonts-style panel-text display-4">To : {formatDate(vehicleDetails.to_date)} </p>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
                <div>
                    <button type="button" className="btn btn-primary btn-lg px-4 gap-3">Pay Now</button>
                    <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={handlePayLaterClick}>Pay Later</button>
                </div>
            </div>
        </div>
    </div>
</section>



            <section data-bs-version="5.1" className="content17 cid-uhGpKnH4UK" id="content17-f">


                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10">
                            <div className="section-head align-center mb-4">
                                <h3 className="mbr-section-title mb-0 mbr-fonts-style display-2">
                                    <strong>Toggle FAQ</strong>
                                </h3>

                            </div>

                            <div id="bootstrap-toggle" className="toggle-panel accordionStyles tab-content">
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingOne">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse1_31" aria-expanded="false" aria-controls="collapse1">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>How to create more items in this list?</strong>
                                            </h6>
                                            <span className="sign mbr-iconfont mbri-arrow-down"></span>
                                        </a>
                                    </div>
                                    <div id="collapse1_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingOne">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">The number of items is limited in this block. Open
                                                the Block parameters to change the amount of items.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingTwo">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse2_31" aria-expanded="false" aria-controls="collapse2">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>What is Mobirise Kit?</strong>
                                            </h6>
                                            <span className="sign mbr-iconfont mbri-arrow-down"></span>
                                        </a>

                                    </div>
                                    <div id="collapse2_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingTwo">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">Mobirise Kit is a service that provides the access to all current and new themes/extensions developed by Mobirise. New themes/extensions are released every month and will be available in your account during your plan period, without any additional charge.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingThree">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse3_31" aria-expanded="false" aria-controls="collapse3">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>Can I create sites for commerical projects?</strong>
                                            </h6>
                                            <span className="sign mbr-iconfont mbri-arrow-down"></span>
                                        </a>
                                    </div>
                                    <div id="collapse3_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">Yes, Mobirise is free for both non-profit and commercial sites.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingThree">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse4_31" aria-expanded="false" aria-controls="collapse4">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>What is Code Editor?</strong>
                                            </h6>
                                            <span className="sign mbr-iconfont mbri-arrow-down"></span>
                                        </a>
                                    </div>
                                    <div id="collapse4_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">
                                                This extension allows editing the code of block in the app. Also, it's possible to add code to the head and body parts of pages.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingThree">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse5_31" aria-expanded="false" aria-controls="collapse5">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>What is Mobirise Kit?</strong></h6>
                                            <span className="mbr-iconfont mobi-mbri-arrow-down mobi-mbri"></span>
                                        </a>
                                    </div>
                                    <div id="collapse5_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">
                                                Mobirise Kit is a service that provides the access to all current and new themes/extensions developed by Mobirise. New themes/extensions are released every month and will be available in your account during your plan period, without any additional charge.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card mb-3">
                                    <div className="card-header" role="tab" id="headingThree">
                                        <a role="button" className="collapsed panel-title text-black" data-toggle="collapse" data-bs-toggle="collapse" data-core="" href="#collapse6_31" aria-expanded="false" aria-controls="collapse6">
                                            <h6 className="panel-title-edit mbr-fonts-style mb-0 display-7"><strong>Can I create sites for commerical projects?</strong></h6>
                                            <span className="mbr-iconfont mobi-mbri-arrow-down mobi-mbri"></span>
                                        </a>
                                    </div>
                                    <div id="collapse6_31" className="panel-collapse noScroll collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <div className="panel-body">
                                            <p className="mbr-fonts-style panel-text display-7">
                                                Yes, Mobirise is free for both non-profit and commercial sites.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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


        </>

    );
};

export default Checkout;