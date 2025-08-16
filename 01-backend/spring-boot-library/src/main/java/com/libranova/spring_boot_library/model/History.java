package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "checkout_at")
    private String checkoutAt;

    @Column(name = "returned_at")
    private String returnedAt;

    @Column(name = "renewal_count")
    private Integer renewalCount;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "overview")
    private String overview;

    @Column(name = "image")
    private String image;
}
