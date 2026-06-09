package com.libranova.spring_boot_library.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.dto.request.PaymentDetailsRequest;
import com.libranova.spring_boot_library.service.PaymentService;
import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    private static final String USER_EMAIL = "user@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor jwtWithEmail() {
        return jwt().jwt(j -> j.subject(USER_EMAIL));
    }

    @Test
    void generatePaymentIntent_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/payments/secure/intent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void generatePaymentIntent_authenticated_returns200() throws Exception {
        PaymentDetailsRequest request = new PaymentDetailsRequest();
        request.setRecipientEmail(USER_EMAIL);
        request.setAmount(600);
        request.setCurrencyCode("eur");

        PaymentIntent mockIntent = mock(PaymentIntent.class);
        when(mockIntent.toJson()).thenReturn("{\"id\":\"pi_test123\",\"status\":\"requires_payment_method\"}");
        when(paymentService.generatePaymentIntent(any(PaymentDetailsRequest.class))).thenReturn(mockIntent);

        mockMvc.perform(post("/api/payments/secure/intent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    void processPayment_authenticated_returns200() throws Exception {
        when(paymentService.processPayment(USER_EMAIL))
                .thenReturn(ResponseEntity.ok("Payment processed successfully."));

        mockMvc.perform(put("/api/payments/secure/execute")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Payment processed successfully."));
    }
}
