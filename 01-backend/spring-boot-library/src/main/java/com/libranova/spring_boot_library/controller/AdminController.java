package com.libranova.spring_boot_library.controller;


import com.libranova.spring_boot_library.dto.request.AddBook;
import com.libranova.spring_boot_library.service.AdminService;
import com.libranova.spring_boot_library.utils.RetrieveJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController
{
    private final AdminService adminService;

    @PostMapping("/secure/add-book")
    public void addNewBook(@RequestBody AddBook addBook, JwtAuthenticationToken jwt) throws AccessDeniedException {
        String userType = jwt.getToken().getClaimAsString("userType");

        if (!"admin".equals(userType)) {
            throw new AccessDeniedException("Only admins can add books.");
        }

        adminService.addNewBook(addBook);
    }
    @PutMapping("/secure/increment/book/copies")
    public void incrementBookCopies(@RequestParam Long bookId, JwtAuthenticationToken jwt) throws AccessDeniedException {
        String userType = jwt.getToken().getClaimAsString("userType");

        if (!"admin".equals(userType)) {
            throw new AccessDeniedException("Only admins can increment book copies.");
        }

        adminService.incrementBookCopies(bookId);
    }

    @PutMapping("/secure/decrement/book/copies")
    public void decrementBookCopies(@RequestParam Long bookId, JwtAuthenticationToken jwt) throws AccessDeniedException {
        String userType = jwt.getToken().getClaimAsString("userType");

        if (!"admin".equals(userType)) {
            throw new AccessDeniedException("Only admins can decrement book copies.");
        }

        adminService.decrementBookCopies(bookId);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestParam Long bookId, JwtAuthenticationToken jwt) throws AccessDeniedException {
        String userType = jwt.getToken().getClaimAsString("userType");

        if (!"admin".equals(userType)) {
            throw new AccessDeniedException("Only admins can delete books.");
        }

        adminService.deleteBook(bookId);
    }




}
