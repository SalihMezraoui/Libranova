package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.ReviewRepository;
import com.libranova.spring_boot_library.dto.request.ReviewRequest;
import com.libranova.spring_boot_library.model.Review;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.extension.ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private ReviewRequest request;

    @BeforeEach
    void setUp() {
        request = new ReviewRequest();
        request.setBookId(1L);
        request.setRatingValue(5);
        request.setComment("Excellent book!");
    }

    @Test
    void addReview_savesReview_whenNotReviewed() {
        // Arrange
        String userEmail = "test@example.com";
        when(reviewRepository.findReviewByUserEmailAndBookId(userEmail, 1L)).thenReturn(null);

        // Act
        reviewService.addReview(userEmail, request);

        // Assert
        verify(reviewRepository, times(1)).save(argThat(review ->
                review.getBookId() == 1L &&
                        review.getRatingValue() == 5 &&
                        review.getUserEmail().equals(userEmail) &&
                        review.getComment().equals("Excellent book!") &&
                        review.getCreatedAt().equals(Date.valueOf(LocalDate.now()))
        ));
    }

    @Test
    void addReview_throwsException_whenAlreadyReviewed() {
        // Arrange
        String userEmail = "test@example.com";
        when(reviewRepository.findReviewByUserEmailAndBookId(userEmail, 1L))
                .thenReturn(new Review());

        // Act + Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> reviewService.addReview(userEmail, request));

        assertEquals("You have already reviewed this book.", ex.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void hasReviewed_returnsTrue_whenReviewExists() {
        when(reviewRepository.findReviewByUserEmailAndBookId("user@example.com", 1L))
                .thenReturn(new Review());

        assertTrue(reviewService.hasReviewed("user@example.com", 1L));
    }

    @Test
    void hasReviewed_returnsFalse_whenReviewNotFound() {
        when(reviewRepository.findReviewByUserEmailAndBookId("user@example.com", 1L))
                .thenReturn(null);

        assertFalse(reviewService.hasReviewed("user@example.com", 1L));
    }
}
