import { useState, useEffect } from "react";
import axios from "axios";
import VehicleBookingModel from "../model/VehicleBookingModel";
import { useOktaAuth } from "@okta/okta-react";

export function useFetchUserBookings(email: string) {
  const [bookings, setBookings] = useState<VehicleBookingModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { authState } = useOktaAuth(); // Access authState here

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!authState || !authState.accessToken) {
          throw new Error("Missing access token for user booking request");
        }

        const accessToken = authState.accessToken; // Access token here

        const response = await axios.get(`${process.env.REACT_APP_API}/api/vehicleBookings/getuserbookings?email=${email}`, {
          responseType: 'json',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data;
        // ... rest of your booking fetching logic
      } catch (error) {
        console.error("Error fetching user booking data:", error);
        // Handle errors gracefully
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchData();
    }
  }, [email]);

  return { bookings, loading };
}
