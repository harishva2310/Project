package com.homerental.dev.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.service.KafkaConsumerService;


@RestController
@RequestMapping("/api/messages")
public class UserBookingNotificationController {
    @Autowired
    private KafkaConsumerService kafkaConsumerService;

    @GetMapping("/userBookingNotifications")
    public List<String> getMessages() {
        return kafkaConsumerService.getUserBookingNotifications();
    }
}
