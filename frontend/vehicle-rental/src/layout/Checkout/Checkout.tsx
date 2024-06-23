import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const location = useLocation();
    const vehicleDetails = location.state;

    return (
        <div>
            <h1>Checkout</h1>
            <p>Vehicle ID: {vehicleDetails.vehicle_id}</p>
            <p>Location ID: {vehicleDetails.location_id}</p>
            <p>Vehicle Location ID: {vehicleDetails.vehicle_location_id}</p>
            <p>From Date: {vehicleDetails.from_date}</p>
            <p>To Date: {vehicleDetails.to_date}</p>
            
            {/* Add further processing and UI elements as needed */}
        </div>
    );
};

export default Checkout;