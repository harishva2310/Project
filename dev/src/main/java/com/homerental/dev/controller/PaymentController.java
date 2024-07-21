package com.homerental.dev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.requestModels.PaymentInfoRequest;
import com.homerental.dev.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {
    
    private PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService){
        this.paymentService=paymentService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException{
        PaymentIntent paymentIntent=paymentService.createPaymentIntent(paymentInfoRequest);
        String paymentStr=paymentIntent.toJson();
        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(JwtAuthenticationToken jwtAuthenticationToken, @RequestParam String email) throws Exception{
        String authenticatedEmail = jwtAuthenticationToken.getToken().getSubject();
            System.out.println("authenticated email= "+authenticatedEmail);
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            return paymentService.stripePayment(email);
    }
}
