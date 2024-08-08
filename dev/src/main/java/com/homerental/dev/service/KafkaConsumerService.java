package com.homerental.dev.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
private final List<String> messages = new ArrayList<>();

    @KafkaListener(topics = "newVehicle", groupId = "my-group")
    public void listen(ConsumerRecord<String, String> record) {
        messages.add(record.value());
    }

    public List<String> getMessages() {
        return new ArrayList<>(messages);
    }
}
