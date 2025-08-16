package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "overview")
    private String overview;

    @Column(name = "overview_de")
    private String overviewDe;

    @Column(name = "total_copies")
    private int totalCopies;

    @Column(name = "copies_in_stock")
    private int copiesInStock;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "year_published")
    private Integer yearPublished;

    @Column(name = "category")
    private String category;

    @Column(name = "image")
    private String image;

    @Column(name = "deleted")
    private boolean deleted = false;
}
