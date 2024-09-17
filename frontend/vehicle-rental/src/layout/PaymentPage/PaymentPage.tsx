import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../util/SpinnerLoading";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CustomUserClaims, UserClaims } from "@okta/okta-auth-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import PaymentInfoRequest from "../../model/PaymentInfoRequest";
import axios from "axios";

export const Payment = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fare, setFare] = useState(0);
    const location = useLocation();
    const bookingDetails = location.state;
    const formData = new FormData();
    const [userInfo, setUserInfo] = useState<UserClaims<CustomUserClaims> | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("authState:", authState);
        console.log("oktaAuth:", oktaAuth);
        if (!authState || !authState.isAuthenticated) {
            setUserInfo(null);
        } else {
            oktaAuth.token.getUserInfo().then(info => {
                console.log("User Info:", info);
                setUserInfo(info);
            }).catch((err) => {
                console.error(err);
            });
        }
    }, [authState, oktaAuth]);

    useEffect(() => {
        console.log("Booking Details:", bookingDetails);
        if (bookingDetails && bookingDetails.total_fare) {
            setFare(bookingDetails.total_fare);
        }
    }, [bookingDetails]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }
        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfoRequest(Math.round(fare*100), 'USD', authState?.accessToken?.claims.sub);

        try {
            const stripeResponse = await axios.post(`${process.env.REACT_APP_API}/api/payment/secure/payment-intent`, paymentInfo, {
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const stripeResponseJson = stripeResponse.data;
            stripe.confirmCardPayment(stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub,
                    },
                },
            }, { handleActions: false })
                .then(async (result: any) => {
                    if (result.error) {
                        setSubmitDisabled(false);
                        alert('There was an error');
                    } else {
                        try {
                            const completeResponse = await axios.put(`api/payment/secure/payment-complete?email=${authState?.accessToken?.claims.sub}`, {}, {
                                headers: {
                                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (!completeResponse.status || completeResponse.status >= 400) {
                                throw new Error('Something went wrong!');
                            }

                            setFare(0);
                            setSubmitDisabled(false);

                            try {
                                formData.append('vehicle_id', bookingDetails.vehicle_id);
                                formData.append('location_id', bookingDetails.location_id);
                                formData.append('vehicle_location_id', bookingDetails.vehicle_location_id);
                                formData.append('total_fare', bookingDetails.total_fare);
                                formData.append('from_date', bookingDetails.from_date);
                                formData.append('to_date', bookingDetails.to_date);
                                if (userInfo?.email) {
                                    formData.append('user_email', userInfo.email);
                                }

                                const response = await axios.post(`${process.env.REACT_APP_API}/api/vehicleBookings`, formData, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                                    },
                                });
                                console.log('Booking confirmed:', response.data);

                                navigate('/confirmation', { state: bookingDetails });

                            } catch (error) {
                                console.error('Error confirming booking:', error);
                            }

                        } catch (error) {
                            console.error('Error completing payment:', error);
                            setHttpError(true);
                            setSubmitDisabled(false);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error creating payment intent:', error);
                    setHttpError(true);
                    setSubmitDisabled(false);
                });

        } catch (error) {
            console.error('Error making payment:', error);
            setHttpError(true);
            setSubmitDisabled(false);
        }
    }

    if (!authState || !authState.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container'>
            {fare > 0 && <div className='card mt-3'>
                <h5 className='card-header'>Fees pending: <span className='text-danger'>${fare}</span></h5>
                <div className='card-body'>
                    <h5 className='card-title mb-3'>Credit Card</h5>
                    <CardElement id='card-element' />
                    <button disabled={submitDisabled} type='button' className='btn btn-primary display-4' 
                        onClick={checkout}>
                        Pay fees
                    </button>
                </div>
            </div>}
            {submitDisabled && <SpinnerLoading />}
        </div>
    );
}

export default Payment;
