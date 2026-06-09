package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.WishlistRepository;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Wishlist;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private WishlistService wishlistService;

    private Book book;
    private Wishlist wishlistItem;

    @BeforeEach
    void setUp() {
        book = Book.builder()
                .id(1L)
                .title("Test Book")
                .author("Test Author")
                .overview("Overview")
                .build();

        wishlistItem = Wishlist.builder()
                .userEmail("user@example.com")
                .bookId(1L)
                .build();
    }

    @Test
    void getWishlistBooks_returnsBooks() {
        when(wishlistRepository.findByUserEmail("user@example.com")).thenReturn(List.of(wishlistItem));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        List<Book> result = wishlistService.getWishlistBooks("user@example.com");

        assertEquals(1, result.size());
        assertEquals("Test Book", result.get(0).getTitle());
    }

    @Test
    void getWishlistBooks_filtersOutMissingBooks() {
        when(wishlistRepository.findByUserEmail("user@example.com")).thenReturn(List.of(wishlistItem));
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        List<Book> result = wishlistService.getWishlistBooks("user@example.com");

        assertTrue(result.isEmpty());
    }

    @Test
    void isWishlisted_returnsTrue_whenExists() {
        when(wishlistRepository.findByUserEmailAndBookId("user@example.com", 1L)).thenReturn(wishlistItem);

        assertTrue(wishlistService.isWishlisted("user@example.com", 1L));
    }

    @Test
    void isWishlisted_returnsFalse_whenNotExists() {
        when(wishlistRepository.findByUserEmailAndBookId("user@example.com", 1L)).thenReturn(null);

        assertFalse(wishlistService.isWishlisted("user@example.com", 1L));
    }

    @Test
    void addToWishlist_savesItem_whenNotAlreadyWishlisted() {
        when(wishlistRepository.findByUserEmailAndBookId("user@example.com", 1L)).thenReturn(null);

        wishlistService.addToWishlist("user@example.com", 1L);

        verify(wishlistRepository).save(any(Wishlist.class));
    }

    @Test
    void addToWishlist_doesNotSave_whenAlreadyWishlisted() {
        when(wishlistRepository.findByUserEmailAndBookId("user@example.com", 1L)).thenReturn(wishlistItem);

        wishlistService.addToWishlist("user@example.com", 1L);

        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }

    @Test
    void removeFromWishlist_deletesItem() {
        wishlistService.removeFromWishlist("user@example.com", 1L);

        verify(wishlistRepository).deleteByUserEmailAndBookId("user@example.com", 1L);
    }
}
