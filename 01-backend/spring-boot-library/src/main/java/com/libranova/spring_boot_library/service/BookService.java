package com.libranova.spring_boot_library.service;


import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.CheckoutRepository;
import com.libranova.spring_boot_library.Repository.HistoryRepository;
import com.libranova.spring_boot_library.Repository.PaymentRepository;
import com.libranova.spring_boot_library.dto.response.UserLoansSummary;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Checkout;
import com.libranova.spring_boot_library.model.History;
import com.libranova.spring_boot_library.model.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    private final CheckoutRepository checkoutRepository;

    private final HistoryRepository historyRepository;

    private final PaymentRepository paymentRepository;

    private static final int CHECKOUT_PERIOD_DAYS = 7;

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Buch mit ID nicht gefunden: " + bookId));

        checkAvailability(book, userEmail);

        List<Checkout> userCheckouts = checkoutRepository.findByUserEmail(userEmail);
        boolean hasOverdueBooks = hasOverdueBooks(userCheckouts);

        Payment payment = paymentRepository.findByUserEmail(userEmail);

        if ((payment != null && payment.getAmount() > 0) || (payment != null && hasOverdueBooks)) {
            throw new Exception("Checkout blocked due to pending payment or overdue items.");
        }

        if (payment == null) {
            createZeroPayment(userEmail);
        }

        decrementBookStock(book);
        createCheckoutRecord(userEmail, book);

        return book;
    }

    private void checkAvailability(Book book, String userEmail) {
        if (checkoutRepository.findByUserEmailAndBookId(userEmail, book.getId()) != null) {
            throw new BookNotAvailableException("Das Buch ist bereits ausgeliehen.");
        }
        if (book.getCopiesInStock() <= 0) {
            throw new BookNotAvailableException("Keine Kopien zur Ausleihe verfügbar.");
        }
    }

    private boolean hasOverdueBooks(List<Checkout> checkouts) {
        LocalDate today = LocalDate.now();

        for (Checkout checkout : checkouts) {
            LocalDate returnDate = LocalDate.parse(checkout.getReturnDate());
            if (returnDate.isBefore(today)) {
                return true;
            }
        }

        return false;
    }

    private void createZeroPayment(String userEmail) {
        Payment newPayment = new Payment();
        newPayment.setUserEmail(userEmail);
        newPayment.setAmount(0.0);
        paymentRepository.save(newPayment);
    }


    private void decrementBookStock(Book book) {
        book.setCopiesInStock(book.getCopiesInStock() - 1);
        bookRepository.save(book);
    }

    private void createCheckoutRecord(String userEmail, Book book) {
        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(CHECKOUT_PERIOD_DAYS).toString(), book.getId());
        checkoutRepository.save(checkout);
    }

    public boolean checkoutBookByUserEmail(String userEmail, Long bookId) {
        return checkoutRepository.findByUserEmailAndBookId(userEmail, bookId) != null;
    }

    public int getNumberOfLoans(String userEmail) {
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

    public void returnBook(String userEmail, Long bookId) throws ParseException {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Buch mit ID " + bookId + " ist nicht verfügbar."));

        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (checkout == null) {
            throw new BookNotAvailableException("Keine aktive Ausleihe für Buch mit ID " + bookId + " gefunden.");
        }

        book.setCopiesInStock(book.getCopiesInStock() + 1);
        bookRepository.save(book);

        // Calculate days overdue
        LocalDate dueDate = LocalDate.parse(checkout.getReturnDate());
        LocalDate today = LocalDate.now();
        long daysOverdue = ChronoUnit.DAYS.between(dueDate, today);

        if (daysOverdue > 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            if (payment == null) {
                payment = new Payment();
                payment.setUserEmail(userEmail);
                payment.setAmount(0.0);
            }

            payment.setAmount(payment.getAmount() + daysOverdue * 2);
            paymentRepository.save(payment);
        }

        checkoutRepository.deleteById(checkout.getId());

        History history = History.builder()
                .userEmail(userEmail)
                .checkoutDate(checkout.getCheckoutDate())
                .returnedDate(LocalDate.now().toString())
                .title(book.getTitle())
                .author(book.getAuthor())
                .overview(book.getOverview())
                .image(book.getImage())
                .build();

        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (checkout == null) {
            throw new BookNotAvailableException("Keine aktive Ausleihe für Buch mit ID " + bookId + " gefunden.");
        }

        LocalDate returnDate = LocalDate.parse(checkout.getReturnDate());
        LocalDate today = LocalDate.now();

        if (!returnDate.isBefore(today)) {
            checkout.setReturnDate(today.plusDays(7).toString());
            checkoutRepository.save(checkout);
        } else {
            throw new Exception("Das Buch kann nicht verlängert werden, da es bereits überfällig ist.");
        }
    }

}
