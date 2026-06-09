package com.libranova.spring_boot_library.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.dto.request.ReviewRequest;
import com.libranova.spring_boot_library.service.ReviewService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReviewService reviewService;

    private static final String USER_EMAIL = "user@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor jwtWithEmail() {
        return jwt().jwt(j -> j.subject(USER_EMAIL));
    }

    @Test
    void hasReviewed_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/reviews/secure/has-reviewed").param("bookId", "1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void hasReviewed_authenticated_returnsBoolean() throws Exception {
        when(reviewService.hasReviewed(USER_EMAIL, 1L)).thenReturn(false);

        mockMvc.perform(get("/api/reviews/secure/has-reviewed")
                        .param("bookId", "1")
                        .with(jwtWithEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    void addReview_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/reviews/secure/add-review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addReview_authenticated_returns200() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setBookId(1L);
        request.setRatingValue(4.5);
        request.setComment("Great book!");

        mockMvc.perform(post("/api/reviews/secure/add-review")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(reviewService).addReview(eq(USER_EMAIL), any(ReviewRequest.class));
    }
}
