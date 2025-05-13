package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController
{
    private final BookService bookService;

    @GetMapping("/secure/currentloans")
    public int getNumberOfLoans()
    {
        String userEmail = "testuser@email.com";
        return bookService.getNumberOfLoans(userEmail);
    }
    @GetMapping("/secure/ischeckedout")
    public boolean checkoutBookByUserEmail( @RequestParam Long bookId)
    {
        String userEmail = "testuser@email.com";
        return bookService.checkoutBookByUserEmail(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception
    {
        String userEmail = "testuser@email.com";
        return bookService.checkoutBook(userEmail,bookId);
    }
}
