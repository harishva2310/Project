package com.homerental.dev.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.dao.PaymentRepository;
import com.homerental.dev.dao.VehicleBookingRepository;
import com.homerental.dev.entity.VehicleBooking;
import com.homerental.dev.responseModels.BookingResponse;
import com.homerental.dev.service.KafkaProducerService;
import com.homerental.dev.service.VehicleBookingService;

@RestController
@RequestMapping("/api/vehicleBookings")
public class VehicleBookingController {

    @Autowired
    private VehicleBookingRepository vehicleBookingRepository;

    @Autowired
    private VehicleBookingService vehicleBookingService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @GetMapping()
    public ResponseEntity<List<VehicleBooking>> getAllVehicleBookings() {
        List<VehicleBooking> vehicleBooking = vehicleBookingRepository.findAll();
        return ResponseEntity.ok(vehicleBooking);
    }

    @GetMapping("/getuserbookings")
    public ResponseEntity<List<VehicleBooking>> getAllUserBookingsByEmail(@RequestParam String email, JwtAuthenticationToken jwtAuthenticationToken) {
        try {

            String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
            System.out.println("authenticated email= " + authenticatedEmail);
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }

            List<VehicleBooking> userBooking = vehicleBookingService.getAllUserBookingsByEmail(email);
            userBooking.sort(Comparator.comparing(VehicleBooking::getVehicle_booking_id).reversed());
            return ResponseEntity.ok(userBooking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/v2/getuserbookings")
    public ResponseEntity<List<BookingResponse>> getBookings(@RequestParam String email, JwtAuthenticationToken jwtAuthenticationToken) {
        try {
            String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
            System.out.println("authenticated email= " + authenticatedEmail);
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(vehicleBookingService.getBookingsByUserEmail(email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<?> addVehicleBooking(
            @RequestParam("vehicle_id") Long vehicleId,
            @RequestParam("location_id") Long locationId,
            @RequestParam("vehicle_location_id") Long vehicleLocationId,
            @RequestParam("total_fare") Double totalFare,
            @RequestParam("from_date") String fromDate,
            @RequestParam("to_date") String toDate,
            @RequestParam("user_email") String userEmail, 
            JwtAuthenticationToken jwtAuthenticationToken) throws ParseException {
        String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
        System.out.println("authenticated email= " + authenticatedEmail);
        if (!userEmail.equals(authenticatedEmail)) {
            return ResponseEntity.status(403).build();
        }
        VehicleBooking vehicleBooking = new VehicleBooking();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        Date parsedFromDate = dateFormat.parse(fromDate);
        Date parsedToDate = dateFormat.parse(toDate);
        vehicleBooking.setVehicle_id(vehicleId);
        vehicleBooking.setFrom_date(parsedFromDate);
        vehicleBooking.setTo_date(parsedToDate);
        vehicleBooking.setLocation_id(locationId);
        vehicleBooking.setVehicle_location_id(vehicleLocationId);
        vehicleBooking.setTotal_fare(totalFare);
        vehicleBooking.setUser_email(userEmail);
        vehicleBookingRepository.save(vehicleBooking);

        LocalDateTime now = LocalDateTime.now();

        // Define the format for the time
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

        // Define the format for the day of the week and full date
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.ENGLISH);

        // Format and print the time
        String formattedTime = now.format(timeFormatter);

        // Format and print the full date
        String formattedDate = now.format(dateFormatter);

        String message = String.format("Congratulations %s! You have made a new booking at %s %s. To view bookings, go to My Bookings present on the top right of the page.", userEmail, formattedDate, formattedTime);
        kafkaProducerService.sendUserBookingNotification(message);

        return ResponseEntity.ok("Booking added successfully");
    }
}
