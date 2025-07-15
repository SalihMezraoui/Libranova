package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.Repository.CheckoutRepository;
import com.libranova.spring_boot_library.Repository.ReviewRepository;
import com.libranova.spring_boot_library.dto.request.AddBook;
import com.libranova.spring_boot_library.exception.BookNotAvailableException;
import com.libranova.spring_boot_library.model.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService
{
    private final BookRepository bookRepository;

    private final ReviewRepository reviewRepository;

    private final CheckoutRepository checkoutRepository;

    public void addNewBook(AddBook addBook) {
        Book book = Book.builder()
                .title(addBook.getTitle())
                .author(addBook.getAuthor())
                .overview(addBook.getOverview())
                .totalCopies(addBook.getTotalCopies())
                .copiesInStock(addBook.getTotalCopies())
                .category(addBook.getCategory())
                .image(addBook.getImage())
                .build();

        bookRepository.save(book);
    }

    public void incrementBookCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        book.setCopiesInStock(book.getCopiesInStock() + 1);
        book.setTotalCopies(book.getTotalCopies() + 1);

        bookRepository.save(book);
    }

    public void decrementBookCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        if (book.getCopiesInStock() <= 0 || book.getTotalCopies() <= 0) {
            throw new BookNotAvailableException("No copies available for book with ID " + bookId);
        }

        book.setCopiesInStock(book.getCopiesInStock() - 1);
        book.setTotalCopies(book.getTotalCopies() - 1);
        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        bookRepository.deleteById(bookId);
        reviewRepository.deleteAllByBookId(bookId);
        checkoutRepository.deleteAllByBookId(bookId);

    }

}
