package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    private static final String USER_EMAIL = "user@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor jwtWithEmail() {
        return jwt().jwt(j -> j.subject(USER_EMAIL));
    }

    @Test
    void getUserLoansSummary_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/books/secure/active-loans"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getUserLoansSummary_authenticated_returns200() throws Exception {
        when(bookService.getUserLoansSummary(USER_EMAIL)).thenReturn(List.of());

        mockMvc.perform(get("/api/books/secure/active-loans").with(jwtWithEmail()))
                .andExpect(status().isOk());
    }

    @Test
    void checkoutBookByUserEmail_authenticated_returnsBoolean() throws Exception {
        when(bookService.checkoutBookByUserEmail(USER_EMAIL, 1L)).thenReturn(true);

        mockMvc.perform(get("/api/books/secure/loans/exists")
                        .param("bookId", "1")
                        .with(jwtWithEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void getNumberOfLoans_authenticated_returnsCount() throws Exception {
        when(bookService.getNumberOfLoans(USER_EMAIL)).thenReturn(3);

        mockMvc.perform(get("/api/books/secure/active-loans/size").with(jwtWithEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }

    @Test
    void checkoutBook_authenticated_returns200() throws Exception {
        mockMvc.perform(put("/api/books/secure/loans/checkout")
                        .param("bookId", "1")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(bookService).checkoutBook(USER_EMAIL, 1L);
    }

    @Test
    void returnBook_authenticated_returns200() throws Exception {
        mockMvc.perform(put("/api/books/secure/loans/return")
                        .param("bookId", "1")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(bookService).returnBook(USER_EMAIL, 1L);
    }

    @Test
    void extendLoan_authenticated_returns200() throws Exception {
        mockMvc.perform(put("/api/books/secure/loans/extend")
                        .param("bookId", "1")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(bookService).extendLoan(USER_EMAIL, 1L);
    }
}
