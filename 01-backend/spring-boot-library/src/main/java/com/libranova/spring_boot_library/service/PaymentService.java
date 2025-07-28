package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.PaymentRepository;
import com.libranova.spring_boot_library.dto.request.PaymentDetailsRequest;
import com.libranova.spring_boot_library.model.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}") String stripeSecretKey) {
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = stripeSecretKey;
    }


    public PaymentIntent generatePaymentIntent(PaymentDetailsRequest paymentDetailsRequest) throws StripeException {
        var params = Map.of(
                "amount", (paymentDetailsRequest.getAmount()),
                "currency", paymentDetailsRequest.getCurrencyCode(),
                "payment_method_types", List.of("card")
        );

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> processPayment(String userEmail){
        var payment = Optional.ofNullable(paymentRepository.findByUserEmail(userEmail))
                .orElseThrow(() -> new IllegalStateException("No payment found for user: " + userEmail));

        payment.setAmount(0.0);
        paymentRepository.save(payment);

        return ResponseEntity.ok().build();
    }
}
