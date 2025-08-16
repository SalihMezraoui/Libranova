package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.CheckoutRepository;
import com.libranova.spring_boot_library.Repository.HistoryRepository;
import com.libranova.spring_boot_library.Repository.PaymentRepository;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Checkout;
import com.libranova.spring_boot_library.model.History;
import com.libranova.spring_boot_library.model.Payment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private CheckoutRepository checkoutRepository;
    @Mock
    private HistoryRepository historyRepository;
    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private BookService bookService;

    private Book book;
    private Checkout checkout;
    private Payment payment;

    @BeforeEach
    void setUp() {
        book = Book.builder()
                .id(1L)
                .title("Book Title")
                .author("Author")
                .overview("Overview")
                .copiesInStock(3)
                .totalCopies(3)
                .build();

        checkout = Checkout.builder()
                .id(100L)
                .bookId(1L)
                .userEmail("user@example.com")
                .checkoutAt(LocalDate.now().toString())
                .returnedAt(LocalDate.now().plusDays(7).toString())
                .renewalCount(0)
                .build();

        payment = new Payment();
        payment.setUserEmail("user@example.com");
        payment.setAmount(0.0);
    }

    @Test
    void checkoutBook_successful() throws Exception {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(checkoutRepository.findByUserEmail("user@example.com")).thenReturn(List.of());
        when(paymentRepository.findPaymentsByUserEmail("user@example.com")).thenReturn(null);

        Book result = bookService.checkoutBook("user@example.com", 1L);

        assertNotNull(result);
        verify(bookRepository).save(any(Book.class));
        verify(checkoutRepository).save(any(Checkout.class));
        verify(paymentRepository).save(any(Payment.class)); // zero payment
    }

    @Test
    void checkoutBook_bookNotFound_throwsException() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(BookNotAvailableException.class,
                () -> bookService.checkoutBook("user@example.com", 1L));
    }

    @Test
    void checkoutBook_withOverdueBooks_throwsException() {
        Checkout overdue = Checkout.builder()
                .returnedAt(LocalDate.now().minusDays(1).toString())
                .build();

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(checkoutRepository.findByUserEmail("user@example.com")).thenReturn(List.of(overdue));
        when(paymentRepository.findPaymentsByUserEmail("user@example.com")).thenReturn(new Payment());

        assertThrows(Exception.class,
                () -> bookService.checkoutBook("user@example.com", 1L));
    }

    @Test
    void returnBook_successful() throws Exception {
        // Setup book
        Book book = new Book();
        book.setId(1L);
        book.setCopiesInStock(1);
        book.setTitle("Test Book");
        book.setAuthor("Author");
        book.setOverview("Overview");
        book.setImage("image.png");

        // Setup checkout with due date in the past
        Checkout checkout = new Checkout();
        checkout.setId(10L);
        checkout.setBookId(1L);
        checkout.setUserEmail("user@example.com");
        checkout.setCheckoutAt(LocalDate.now().minusDays(10).toString());
        checkout.setReturnedAt(LocalDate.now().minusDays(3).toString()); // overdue 3 days
        checkout.setRenewalCount(0);

        // Setup payment
        Payment payment = new Payment();
        payment.setUserEmail("user@example.com");
        payment.setAmount(0.0);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(checkout);
        when(paymentRepository.findPaymentsByUserEmail("user@example.com")).thenReturn(payment);

        bookService.returnBook("user@example.com", 1L);

        // Verify book stock incremented
        verify(bookRepository).save(book);

        // Verify checkout deleted
        verify(checkoutRepository).deleteById(checkout.getId());

        // Verify history saved
        verify(historyRepository).save(any(History.class));

        // Verify payment updated with overdue
        assertEquals(6.0, payment.getAmount()); // 3 days * 2
        verify(paymentRepository).save(payment);
    }


    @Test
    void returnBook_noCheckoutFound_throwsException() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(null);

        assertThrows(BookNotAvailableException.class,
                () -> bookService.returnBook("user@example.com", 1L));
    }

    @Test
    void extendLoan_successful() throws Exception {
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(checkout);

        bookService.extendLoan("user@example.com", 1L);

        verify(checkoutRepository).save(checkout);
        assertEquals(1, checkout.getRenewalCount());
    }

    @Test
    void extendLoan_overdue_throwsException() {
        checkout.setReturnedAt(LocalDate.now().minusDays(1).toString());
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(checkout);

        assertThrows(Exception.class,
                () -> bookService.extendLoan("user@example.com", 1L));
    }

    @Test
    void getNumberOfLoans_returnsCount() {
        when(checkoutRepository.findByUserEmail("user@example.com")).thenReturn(List.of(checkout, checkout));

        int count = bookService.getNumberOfLoans("user@example.com");

        assertEquals(2, count);
    }

    @Test
    void checkoutBookByUserEmail_trueWhenExists() {
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(checkout);

        assertTrue(bookService.checkoutBookByUserEmail("user@example.com", 1L));
    }

    @Test
    void checkoutBookByUserEmail_falseWhenNotExists() {
        when(checkoutRepository.findByBookIdAndUserEmail(1L, "user@example.com")).thenReturn(null);

        assertFalse(bookService.checkoutBookByUserEmail("user@example.com", 1L));
    }
}
