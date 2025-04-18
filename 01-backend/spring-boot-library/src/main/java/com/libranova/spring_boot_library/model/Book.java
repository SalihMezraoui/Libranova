package com.libranova.spring_boot_library.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "book")
@Data
public class Book
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "description")
    private String overview;

    @Column(name = "copies")
    private int totalCopies;

    @Column(name = "copies_available")
    private int copiesInStock;

    @Column(name = "category")
    private String category;

    @Column(name = "img")
    private String image;

}
