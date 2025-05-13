package com.libranova.spring_boot_library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class BookNotAvailableException extends RuntimeException
{
    public BookNotAvailableException(String message)
    {
        super(message);
    }
}
