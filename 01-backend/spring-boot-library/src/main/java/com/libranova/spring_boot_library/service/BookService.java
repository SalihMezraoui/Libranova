package com.libranova.spring_boot_library.service;


import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.CheckoutRepository;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Checkout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService
{
    private final BookRepository bookRepository;

    private final CheckoutRepository checkoutRepository;

    private static final int CHECKOUT_PERIOD_DAYS = 7;

    public Book checkoutBook(String userEmail, Long bookId) throws Exception
    {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Buch mit ID nicht gefunden: " + bookId));

        checkAvailability(book, userEmail);
        decrementBookStock(book);
        createCheckoutRecord(userEmail, book);

        return book;
    }

    private void checkAvailability(Book book, String userEmail)
    {
        if (checkoutRepository.findByUserEmailAndBookId(userEmail, book.getId()) != null) {
            throw new BookNotAvailableException("Das Buch ist bereits ausgeliehen.");
        }
        if (book.getCopiesInStock() <= 0) {
            throw new BookNotAvailableException("Keine Kopien zur Ausleihe verfügbar.");
        }
    }

    private void decrementBookStock(Book book)
    {
        book.setCopiesInStock(book.getCopiesInStock() - 1);
        bookRepository.save(book);
    }

    private void createCheckoutRecord(String userEmail, Book book)
    {
        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(CHECKOUT_PERIOD_DAYS).toString(), book.getId());
        checkoutRepository.save(checkout);
    }

    public boolean checkoutBookByUserEmail(String userEmail, Long bookId)
    {
        return checkoutRepository.findByUserEmailAndBookId(userEmail, bookId) != null;
    }

    public int getNumberOfLoans(String userEmail)
    {
        return checkoutRepository.findByUserEmail(userEmail).size();
    }

}
