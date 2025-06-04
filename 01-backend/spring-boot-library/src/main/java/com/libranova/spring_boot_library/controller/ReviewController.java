package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.dto.ReviewRequest;
import com.libranova.spring_boot_library.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/reviews")
@RestController
@RequiredArgsConstructor
public class ReviewController
{
    private final ReviewService reviewService;

    @GetMapping("/secure/hasreviewed")
    public boolean hasReviewed(Authentication authentication, @RequestParam Long bookId) throws Exception
    {
        String userEmail = authentication.getName();
        if (userEmail == null || userEmail.isEmpty()) {
            throw new Exception("User email not found");
        }
        return reviewService.hasReviewed(userEmail, bookId);
    }

    @PostMapping("/secure")
    public void addReview(Authentication authentication, @RequestBody ReviewRequest reviewRequest) throws Exception
    {
        String userEmail = authentication.getName();
        if (userEmail == null || userEmail.isEmpty()) {
            throw new Exception("User email is required for adding a review.");
        }
        reviewService.addReview(userEmail, reviewRequest);
    }
}
