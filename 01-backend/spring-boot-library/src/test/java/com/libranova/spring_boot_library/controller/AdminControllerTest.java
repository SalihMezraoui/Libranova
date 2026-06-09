package com.libranova.spring_boot_library.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.dto.request.AddBook;
import com.libranova.spring_boot_library.service.AdminService;
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

@WebMvcTest(AdminController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    private static final String ADMIN_EMAIL = "admin@example.com";
    private static final String USER_EMAIL  = "user@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor adminJwt() {
        return jwt().jwt(j -> j.subject(ADMIN_EMAIL).claim("https://libranova.com/userType", "admin"));
    }

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor userJwt() {
        return jwt().jwt(j -> j.subject(USER_EMAIL).claim("https://libranova.com/userType", "user"));
    }

    @Test
    void addNewBook_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/admin/secure/post/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addNewBook_asAdmin_returns200() throws Exception {
        AddBook addBook = new AddBook();
        addBook.setTitle("Clean Code");
        addBook.setAuthor("Robert Martin");
        addBook.setOverview("Good practices");
        addBook.setTotalCopies(5);
        addBook.setCategory("Technology");

        mockMvc.perform(post("/api/admin/secure/post/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addBook))
                        .with(adminJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).addNewBook(any());
    }

    @Test
    void addNewBook_asNonAdmin_returns403() throws Exception {
        mockMvc.perform(post("/api/admin/secure/post/book")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}").with(userJwt()).with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void incrementBookCopies_asAdmin_returns200() throws Exception {
        mockMvc.perform(put("/api/admin/secure/increment/book/copies")
                        .param("bookId", "1")
                        .with(adminJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).incrementBookCopies(1L);
    }

    @Test
    void incrementBookCopies_asNonAdmin_returns403() throws Exception {
        mockMvc.perform(put("/api/admin/secure/increment/book/copies")
                        .param("bookId", "1")
                        .with(userJwt()).with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void decrementBookCopies_asAdmin_returns200() throws Exception {
        mockMvc.perform(put("/api/admin/secure/decrement/book/copies")
                        .param("bookId", "1")
                        .with(adminJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).decrementBookCopies(1L);
    }

    @Test
    void deleteBook_asAdmin_returns200() throws Exception {
        mockMvc.perform(delete("/api/admin/secure/remove/book")
                        .param("bookId", "1")
                        .with(adminJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(adminService).deleteBook(1L);
    }

    @Test
    void deleteBook_asNonAdmin_returns403() throws Exception {
        mockMvc.perform(delete("/api/admin/secure/remove/book")
                        .param("bookId", "1")
                        .with(userJwt()).with(csrf()))
                .andExpect(status().isForbidden());
    }
}
