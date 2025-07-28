package com.libranova.spring_boot_library.dto.request;

import lombok.Data;

@Data
public class PaymentDetailsRequest {
    private String recipientEmail;
    private double amount;
    private String currencyCode;
}
