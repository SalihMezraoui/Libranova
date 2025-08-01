package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.dto.response.UserLoansSummary;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController
{
    private final BookService bookService;

    @GetMapping("/secure/currentloans")
    public List<UserLoansSummary> getUserLoansSummary(Authentication authentication) throws Exception {
        String userEmail = authentication.getName();
        return bookService.getUserLoansSummary(userEmail);
    }

    @GetMapping("/secure/currentloans/size")
    public int getNumberOfLoans(Authentication authentication)
    {
        String userEmail = authentication.getName();
        return bookService.getNumberOfLoans(userEmail);
    }

    @GetMapping("/secure/ischeckedout")
    public boolean checkoutBookByUserEmail(@RequestParam Long bookId, Authentication authentication) {
        System.out.println("Received request for /secure/ischeckedout with bookId: " + bookId);
        System.out.println("Authentication: " + authentication);
        String userEmail = authentication.getName();
        System.out.println("User email: " + userEmail);
        boolean result = bookService.checkoutBookByUserEmail(userEmail, bookId);
        System.out.println("Returning result: " + result);
        return result;
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(Authentication authentication,
                             @RequestParam Long bookId) throws Exception
    {
        String userEmail = authentication.getName();
        return bookService.checkoutBook(userEmail,bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(Authentication authentication,
                           @RequestParam Long bookId) throws ParseException {
        String userEmail = authentication.getName();
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/extend/loan")
    public void renewLoan(Authentication authentication,
                          @RequestParam Long bookId) throws Exception
    {
        String userEmail = authentication.getName();
        bookService.renewLoan(userEmail, bookId);
    }
}
