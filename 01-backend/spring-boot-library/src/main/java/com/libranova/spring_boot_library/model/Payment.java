package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "status")
    private String status;

    @Column(name = "amount")
    private double amount;

    @Column(name = "currency_code")
    private String currencyCode;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(name = "created_at")
    private String createdAt;
}
