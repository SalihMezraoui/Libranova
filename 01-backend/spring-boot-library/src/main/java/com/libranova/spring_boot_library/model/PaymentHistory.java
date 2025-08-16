package com.libranova.spring_boot_library.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "invoice_reference")
    private String invoiceReference;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "method_type")
    private String methodType;
}
