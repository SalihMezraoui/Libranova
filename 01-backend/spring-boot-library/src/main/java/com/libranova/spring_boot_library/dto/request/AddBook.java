package com.libranova.spring_boot_library.dto.request;


import lombok.Data;

@Data
public class AddBook
{
    private String title;

    private String author;

    private String overview;

    private int totalCopies;

    private String category;

    private String image;
}
