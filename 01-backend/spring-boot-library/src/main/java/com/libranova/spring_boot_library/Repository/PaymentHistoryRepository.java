package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.PaymentHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    Page<PaymentHistory> findByUserEmail(@RequestParam("email") String userEmail, Pageable pageable);

}
