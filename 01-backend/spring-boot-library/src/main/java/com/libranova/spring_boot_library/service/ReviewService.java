package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.ReviewRepository;
import com.libranova.spring_boot_library.dto.request.ReviewRequest;
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

    public void addReview(String userEmail, ReviewRequest request) {
        boolean alreadyReviewed = hasReviewed(userEmail, request.getBookId());
        if (alreadyReviewed) {
            throw new IllegalStateException("You have already reviewed this book.");
        }

        Review review = Review.builder()
                .bookId(request.getBookId())
                .rating(request.getRating())
                .userEmail(userEmail)
                .reviewDescription(request.getReviewDescription())
                .date(Date.valueOf(LocalDate.now()))
                .build();

        reviewRepository.save(review);
    }

    public boolean hasReviewed(String userEmail, Long bookId)
    {
        return reviewRepository.findByUserEmailAndBookId(userEmail, bookId) != null;
    }

}
