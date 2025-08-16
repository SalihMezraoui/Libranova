package com.libranova.spring_boot_library.dto.request;

import lombok.Data;

@Data
public class ReviewRequest
{
    private double ratingValue;

    private long bookId;

    private String comment;
}
