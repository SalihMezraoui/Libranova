package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.service.WishlistService;
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

@WebMvcTest(WishlistController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class WishlistControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WishlistService wishlistService;

    private static final String USER_EMAIL = "user@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor jwtWithEmail() {
        return jwt().jwt(j -> j.subject(USER_EMAIL));
    }

    @Test
    void getWishlist_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/wishlists/secure"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getWishlist_authenticated_returnsBooks() throws Exception {
        Book book = Book.builder().id(1L).title("Clean Code").author("Robert Martin").build();
        when(wishlistService.getWishlistBooks(USER_EMAIL)).thenReturn(List.of(book));

        mockMvc.perform(get("/api/wishlists/secure").with(jwtWithEmail()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Clean Code"));
    }

    @Test
    void isWishlisted_authenticated_returnsTrue() throws Exception {
        when(wishlistService.isWishlisted(USER_EMAIL, 1L)).thenReturn(true);

        mockMvc.perform(get("/api/wishlists/secure/exists")
                        .param("bookId", "1")
                        .with(jwtWithEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void addToWishlist_authenticated_delegatesToService() throws Exception {
        mockMvc.perform(post("/api/wishlists/secure/add")
                        .param("bookId", "1")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(wishlistService).addToWishlist(USER_EMAIL, 1L);
    }

    @Test
    void removeFromWishlist_authenticated_delegatesToService() throws Exception {
        mockMvc.perform(delete("/api/wishlists/secure/remove")
                        .param("bookId", "1")
                        .with(jwtWithEmail()).with(csrf()))
                .andExpect(status().isOk());

        verify(wishlistService).removeFromWishlist(USER_EMAIL, 1L);
    }
}
