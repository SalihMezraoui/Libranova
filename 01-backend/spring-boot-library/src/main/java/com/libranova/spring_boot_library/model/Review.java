package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    @Column(name = "rating_value", nullable = false)
    private double ratingValue;

    @Column(name = "book_id")
    private long bookId;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "language")
    private String language;
}
