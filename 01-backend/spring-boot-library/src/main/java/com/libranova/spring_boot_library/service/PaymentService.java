package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.PaymentHistoryRepository;
import com.libranova.spring_boot_library.Repository.PaymentRepository;
import com.libranova.spring_boot_library.dto.request.PaymentDetailsRequest;
import com.libranova.spring_boot_library.model.PaymentHistory;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final PaymentHistoryRepository paymentHistoryRepository;

    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret}") String stripeSecretKey, PaymentHistoryRepository paymentHistoryRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentHistoryRepository = paymentHistoryRepository;
        Stripe.apiKey = stripeSecretKey;
    }


    public PaymentIntent generatePaymentIntent(PaymentDetailsRequest paymentDetailsRequest) throws StripeException {
        var params = Map.of(
                "amount", (paymentDetailsRequest.getAmount()),
                "currency", paymentDetailsRequest.getCurrencyCode(),
                "payment_method_types", List.of("card"),
                "receipt_email", paymentDetailsRequest.getRecipientEmail(),
                "description", "Libranova purchase"
        );

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> processPayment(String userEmail){
        var payment = Optional.ofNullable(paymentRepository.findPaymentsByUserEmail(userEmail))
                .orElseThrow(() -> new IllegalStateException("No payment found for user: " + userEmail));

        double amountPaid = payment.getAmount();
        payment.setAmount(0.0);
        paymentRepository.save(payment);

        PaymentHistory paymentHistory = PaymentHistory.builder()
                .userEmail(userEmail)
                .invoiceReference(UUID.randomUUID().toString()) // unique reference
                .paymentDate(LocalDateTime.now())
                .amount(amountPaid)
                .methodType("Stripe")
                .build();

        paymentHistoryRepository.save(paymentHistory);

        return ResponseEntity.ok().build();
    }
}
