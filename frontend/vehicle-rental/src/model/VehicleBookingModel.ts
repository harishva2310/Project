class VehicleBookingModel{
    vehicle_booking_id: number;
    location_id: number;
    vehicle_id: number;
    user_email: string;
	vehicle_location_id: number;
	from_date: string;
	to_date: string;
    total_fare: number;
	
    constructor (vehicle_booking_id: number,
        location_id: number,
    vehicle_id: number,
	user_email: string,
	vehicle_location_id: number,
	from_date: string,
	to_date: string,
    total_fare: number
    )
        {
            this.vehicle_booking_id=vehicle_booking_id;
            this.location_id=location_id;
            this.vehicle_id=vehicle_id;
            this.user_email=user_email;
			this.vehicle_location_id=vehicle_location_id;
			this.from_date=from_date;
			this.to_date=to_date;
            this.total_fare=total_fare;
        }
}
export default VehicleBookingModel;