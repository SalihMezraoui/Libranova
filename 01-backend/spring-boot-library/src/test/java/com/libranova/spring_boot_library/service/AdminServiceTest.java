package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.ReviewRepository;
import com.libranova.spring_boot_library.dto.request.AddBook;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private AdminService adminService;

    private Book book;

    @BeforeEach
    void setUp() {
        book = Book.builder()
                .id(1L)
                .title("Test Book")
                .author("Author")
                .overview("Overview")
                .totalCopies(5)
                .copiesInStock(5)
                .category("Fiction")
                .image("image.png")
                .deleted(false)
                .build();
    }

    @Test
    void addNewBook_savesBook() {
        AddBook addBook = new AddBook();
        addBook.setTitle("New Book");
        addBook.setAuthor("Author");
        addBook.setOverview("Overview");
        addBook.setTotalCopies(3);
        addBook.setCategory("Drama");
        addBook.setImage("image.png");

        adminService.addNewBook(addBook);

        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void incrementBookCopies_increasesCounts() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        adminService.incrementBookCopies(1L);

        assertEquals(6, book.getCopiesInStock());
        assertEquals(6, book.getTotalCopies());
        verify(bookRepository).save(book);
    }

    @Test
    void incrementBookCopies_bookNotFound_throwsException() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BookNotAvailableException.class, () -> adminService.incrementBookCopies(1L));
    }

    @Test
    void decrementBookCopies_decreasesCounts() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        adminService.decrementBookCopies(1L);

        assertEquals(4, book.getCopiesInStock());
        assertEquals(4, book.getTotalCopies());
        verify(bookRepository).save(book);
    }

    @Test
    void decrementBookCopies_noCopies_throwsException() {
        book.setCopiesInStock(0);
        book.setTotalCopies(0);
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThrows(BookNotAvailableException.class, () -> adminService.decrementBookCopies(1L));
    }

    @Test
    void deleteBook_setsDeletedAndRemovesReviews() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        adminService.deleteBook(1L);

        assertTrue(book.isDeleted());
        verify(bookRepository).save(book);
        verify(reviewRepository).removeReviewsByBookId(1L);
    }

    @Test
    void deleteBook_notFound_throwsException() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BookNotAvailableException.class, () -> adminService.deleteBook(1L));
    }
}
