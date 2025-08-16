package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Custom query to find payments by user email
    Payment findPaymentsByUserEmail(String userEmail);
}
