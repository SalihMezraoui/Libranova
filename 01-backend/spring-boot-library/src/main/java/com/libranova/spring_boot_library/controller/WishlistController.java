package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
@RequestMapping("/api/wishlists")
@RestController
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/secure")
    public List<Book> getWishlist(Authentication auth) {
        String userEmail = auth.getName();
        validateUserEmail(userEmail);
        return wishlistService.getWishlistBooks(userEmail);
    }

    @GetMapping("/secure/exists")
    public boolean isWishlisted(Authentication auth, @RequestParam Long bookId) {
        String userEmail = auth.getName();
        validateUserEmail(userEmail);
        return wishlistService.isWishlisted(userEmail, bookId);
    }

    @PostMapping("/secure/add")
    public void addToWishlist(Authentication auth, @RequestParam Long bookId) {
        String userEmail = auth.getName();
        validateUserEmail(userEmail);
        wishlistService.addToWishlist(userEmail, bookId);
    }

    @DeleteMapping("/secure/remove")
    public void removeFromWishlist(Authentication auth, @RequestParam Long bookId) {
        String userEmail = auth.getName();
        validateUserEmail(userEmail);
        wishlistService.removeFromWishlist(userEmail, bookId);
    }

    private void validateUserEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("User email is required.");
        }
    }
}
