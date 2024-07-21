package com.homerental.dev.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.homerental.dev.dao.VehicleBookingRepository;
import com.homerental.dev.entity.VehicleBooking;
import com.homerental.dev.responseModels.BookingResponse;

@Service
public class VehicleBookingService {

    @Autowired
    private VehicleBookingRepository vehicleBookingRepository;

    public List<VehicleBooking> getAllUserBookingsByEmail(String email){
        return vehicleBookingRepository.findUserBookingByEmail(email);
    }

    public List<BookingResponse> getBookingsByUserEmail(String email) {
        return vehicleBookingRepository.findBookingsByUserEmail(email);
    }
}
