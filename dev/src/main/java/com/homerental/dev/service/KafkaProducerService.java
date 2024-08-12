package com.homerental.dev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private static final String newVehicleTopic = "newVehicle";
    private static final String userBookingTopic = "userBooking";

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String msg) {
        kafkaTemplate.send(newVehicleTopic, msg);
    }

    public void sendUserBookingNotification(String msg) {
        kafkaTemplate.send(userBookingTopic, msg);
    }
}
