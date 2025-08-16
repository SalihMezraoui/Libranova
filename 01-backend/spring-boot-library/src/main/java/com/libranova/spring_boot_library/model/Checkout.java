package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "checkout")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checkout
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "renewal_count")
    private Integer renewalCount;

    @Column(name = "checkout_at")
    private String checkoutAt;

    @Column(name = "returned_at")
    private String returnedAt;

    @Column(name = "book_id")
    private Long bookId;
}