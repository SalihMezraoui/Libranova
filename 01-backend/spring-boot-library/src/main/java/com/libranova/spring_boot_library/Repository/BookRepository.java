package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;


public interface BookRepository extends JpaRepository<Book, Long>
{
    Page<Book> findByTitleContainingIgnoreCaseAndDeletedFalse(@RequestParam("title") String title, Pageable pageable);

    Page<Book> findByCategoryAndDeletedFalse(@RequestParam("category") String category, Pageable pageable);

    Page<Book> findByTitleContainingIgnoreCaseAndCategoryAndDeletedFalse(String title, String category, Pageable pageable);

    Page<Book> findByDeletedFalse(Pageable pageable);

    Optional<Book> findByIdAndDeletedFalse(Long id);

    @Query("SELECT b FROM Book b WHERE b.id IN :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookId);
}
