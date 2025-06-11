package com.libranova.spring_boot_library.service;


import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.CheckoutRepository;
import com.libranova.spring_boot_library.dto.response.UserLoansSummary;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Checkout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    public List<UserLoansSummary> getUserLoansSummary(String userEmail) throws ParseException {
        // Retrieving all checkouts for the user
        List<Checkout> checkouts = checkoutRepository.findByUserEmail(userEmail);

        // Extracting book IDs from checkouts
        List<Long> bookIds = checkouts.stream()
                .map(Checkout::getBookId)
                .toList();

        // Get corresponding books
        List<Book> books = bookRepository.findBooksByBookIds(bookIds);

        // date objects
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date today = sdf.parse(LocalDate.now().toString());

        // map of bookId -> returnDate
        Map<Long, String> returnDateMap = checkouts.stream()
                .collect(Collectors.toMap(Checkout::getBookId, Checkout::getReturnDate));

        // Build response list
        List<UserLoansSummary> summaryList = new ArrayList<>();
        for (Book book : books) {
            String returnDateStr = returnDateMap.get(book.getId());
            if (returnDateStr != null) {
                Date returnDate = sdf.parse(returnDateStr);
                long diffMillis = returnDate.getTime() - today.getTime();
                int daysRemaining = (int) TimeUnit.MILLISECONDS.toDays(diffMillis);
                summaryList.add(new UserLoansSummary(book, daysRemaining));
            }
        }

        return summaryList;
    }

}
