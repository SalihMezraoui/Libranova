package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.dto.request.PaymentDetailsRequest;
import com.libranova.spring_boot_library.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/payments/secure")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/intent")
    public ResponseEntity<String> generatePaymentIntent(@RequestBody PaymentDetailsRequest paymentDetailsRequest)
            throws StripeException {

        PaymentIntent paymentIntent = paymentService.generatePaymentIntent(paymentDetailsRequest);

        return ResponseEntity.ok(paymentIntent.toJson());
    }

    @PutMapping("/execute")
    public ResponseEntity<String> processPayment(Authentication authentication) {
        String userEmail = authentication.getName();

        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalArgumentException("Authenticated user email is required.");
        }

        return paymentService.processPayment(userEmail);
    }
}