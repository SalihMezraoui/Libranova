package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookRepository extends JpaRepository<Book, Long>
{
}
