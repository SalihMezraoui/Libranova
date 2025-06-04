package com.libranova.spring_boot_library.dto;

import lombok.Data;


@Data
public class ReviewRequest
{
    private double rating;

    private long bookId;

    private String reviewDescription;
}
