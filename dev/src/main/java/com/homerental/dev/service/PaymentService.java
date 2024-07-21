package com.homerental.dev.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homerental.dev.dao.PaymentRepository;
import com.homerental.dev.entity.Payment;
import com.homerental.dev.requestModels.PaymentInfoRequest;
import com.stripe.Stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;



@Service
@Transactional
public class PaymentService {

    private PaymentRepository paymentRepository;
    

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.apiKey}") String secretKey){
        this.paymentRepository=paymentRepository;
        Stripe.apiKey=secretKey;
    }

    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException{
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> stripePayment(String userEmail) throws Exception{
        Payment payment=new Payment();

        payment.setUserEmail(userEmail);
        payment.setAmount(00.00);
        paymentRepository.save(payment);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
