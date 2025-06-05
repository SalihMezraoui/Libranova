package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.ReviewRepository;
import com.libranova.spring_boot_library.dto.ReviewRequest;
import com.libranova.spring_boot_library.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService
{
    private final ReviewRepository reviewRepository;

    public void addReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review existingReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if (existingReview != null) {
            throw new Exception("You have already reviewed this book.");
        }

        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        review.setReviewDescription(reviewRequest.getReviewDescription());
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }

    public boolean hasReviewed(String userEmail, Long bookId)
    {
        return reviewRepository.findByUserEmailAndBookId(userEmail, bookId) != null;
    }

}
