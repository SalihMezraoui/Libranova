package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long>
{
    // Custom query to find a checkout by user email and book ID
    Checkout findByBookIdAndUserEmail(Long bookId, String userEmail);

    List<Checkout> findByUserEmail(String userEmail);

}
