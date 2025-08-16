package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
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
        var book = bookRepository.findById(bookId)
                .map(b -> {
                    b.setCopiesInStock(b.getCopiesInStock() + 1);
                    b.setTotalCopies(b.getTotalCopies() + 1);
                    return b;
                })
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        bookRepository.save(book);
    }

    public void decrementBookCopies(Long bookId) {
        var book = bookRepository.findById(bookId)
                .map(b -> {
                    if (b.getCopiesInStock() <= 0 || b.getTotalCopies() <= 0) {
                        throw new BookNotAvailableException("No copies available for book with ID " + bookId);
                    }
                    b.setCopiesInStock(b.getCopiesInStock() - 1);
                    b.setTotalCopies(b.getTotalCopies() - 1);
                    return b;
                })
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotAvailableException("Book with ID " + bookId + " not found."));

        book.setDeleted(true);
        bookRepository.save(book);
        reviewRepository.removeReviewsByBookId(bookId);
    }

}
