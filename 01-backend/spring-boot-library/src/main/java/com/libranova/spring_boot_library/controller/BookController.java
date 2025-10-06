package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.dto.response.UserLoansSummary;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
@RequiredArgsConstructor
public class BookController
{
    private final BookService bookService;

    // --- READ endpoints ---
    @GetMapping("/secure/active-loans")
    public List<UserLoansSummary> getUserLoansSummary(Authentication authentication) throws Exception {
        String userEmail = authentication.getName();
        System.out.println("[DEBUG] Fetching loans summary for user: " + userEmail);
        return bookService.getUserLoansSummary(userEmail);
    }

    @GetMapping("/secure/loans/exists")
    public boolean checkoutBookByUserEmail(@RequestParam Long bookId, Authentication authentication) {
        System.out.println("Received request for secure/loans/exists with bookId: " + bookId);
        System.out.println("Authentication: " + authentication);
        String userEmail = authentication.getName();
        System.out.println("User email: " + userEmail);
        boolean result = bookService.checkoutBookByUserEmail(userEmail, bookId);
        System.out.println("Returning result: " + result);
        return result;
    }

    @GetMapping("/secure/active-loans/size")
    public int getNumberOfLoans(Authentication authentication)
    {
        String userEmail = authentication.getName();
        System.out.println("[DEBUG] Fetching number of loans for user: " + userEmail);
        return bookService.getNumberOfLoans(userEmail);
    }

    // --- WRITE endpoints ---
    @PutMapping("/secure/loans/checkout")
    public Book checkoutBook(Authentication authentication,
                             @RequestParam Long bookId) throws Exception
    {
        String userEmail = authentication.getName();
        System.out.println("[checkoutBook] Extracted userEmail: " + userEmail);
        return bookService.checkoutBook(userEmail,bookId);
    }

    @PutMapping("/secure/loans/return")
    public void returnBook(Authentication authentication,
                           @RequestParam Long bookId) {
        String userEmail = authentication.getName();
        System.out.println("[returnBook] Extracted userEmail: " + userEmail);
        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/loans/extend")
    public void extendLoan(Authentication authentication,
                          @RequestParam Long bookId) throws Exception
    {
        String userEmail = authentication.getName();
        System.out.println("[extendLoan] Extracted userEmail: " + userEmail);
        bookService.extendLoan(userEmail, bookId);
    }
}
