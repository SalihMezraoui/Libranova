package com.libranova.spring_boot_library.Repository;

import com.libranova.spring_boot_library.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {


}
