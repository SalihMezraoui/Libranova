package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.PaymentHistoryRepository;
import com.libranova.spring_boot_library.Repository.PaymentRepository;
import com.libranova.spring_boot_library.dto.request.PaymentDetailsRequest;
import com.libranova.spring_boot_library.model.Payment;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentHistoryRepository paymentHistoryRepository;

    @InjectMocks
    private PaymentService paymentService;

    private PaymentDetailsRequest paymentDetailsRequest;
    private Payment payment;

    @BeforeEach
    void setUp() {
        paymentDetailsRequest = new PaymentDetailsRequest();
        paymentDetailsRequest.setAmount(100);
        paymentDetailsRequest.setCurrencyCode("usd");
        paymentDetailsRequest.setRecipientEmail("user@example.com");

        payment = new Payment();
        payment.setUserEmail("user@example.com");
        payment.setAmount(50.0);
    }

    @Test
    void generatePaymentIntent_returnsIntent() throws StripeException {
        PaymentIntent mockIntent = mock(PaymentIntent.class);

        try (MockedStatic<PaymentIntent> paymentIntentMock = mockStatic(PaymentIntent.class)) {
            // explicitly use anyMap() for Map<String, Object>
            paymentIntentMock.when(() ->
                    PaymentIntent.create(anyMap()) // this ensures the Map-based overload is chosen
            ).thenReturn(mockIntent);

            PaymentIntent result = paymentService.generatePaymentIntent(paymentDetailsRequest);

            assertNotNull(result);

            // verify called with correct map contents
            paymentIntentMock.verify(() ->
                    PaymentIntent.create(argThat((Map<String, Object> params) -> {
                        Object paymentMethods = params.get("payment_method_types");
                        if (!(paymentMethods instanceof List<?> list)) return false;

                        boolean hasCard = list.contains("card");
                        return params.get("amount").equals(100)
                                && params.get("currency").equals("usd")
                                && hasCard
                                && params.get("receipt_email").equals("user@example.com")
                                && params.get("description").equals("Libranova purchase");
                    }))
            );
        }
    }

    @Test
    void processPayment_success() {
        when(paymentRepository.findPaymentsByUserEmail("user@example.com"))
                .thenReturn(payment);

        ResponseEntity<String> response = paymentService.processPayment("user@example.com");

        assertEquals(0.0, payment.getAmount());
        assertEquals(ResponseEntity.ok().build(), response);

        verify(paymentRepository).save(payment);
        verify(paymentHistoryRepository).save(argThat(history ->
                history.getUserEmail().equals("user@example.com") &&
                        history.getAmount() == 50.0 &&
                        history.getMethodType().equals("Stripe") &&
                        history.getInvoiceReference() != null &&
                        history.getPaymentDate() != null
        ));
    }

    @Test
    void processPayment_noPaymentFound_throwsException() {
        when(paymentRepository.findPaymentsByUserEmail("user@example.com"))
                .thenReturn(null);

        assertThrows(IllegalStateException.class,
                () -> paymentService.processPayment("user@example.com"));

        verify(paymentRepository, never()).save(any());
        verify(paymentHistoryRepository, never()).save(any());
    }
}
