package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.BookRepository;
import com.libranova.spring_boot_library.dto.request.AddBook;
import com.libranova.spring_boot_library.model.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService
{
    private final BookRepository bookRepository;

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

}
