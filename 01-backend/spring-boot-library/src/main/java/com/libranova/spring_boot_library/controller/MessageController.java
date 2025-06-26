package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.model.Message;
import com.libranova.spring_boot_library.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController
{
    private final MessageService messageService;

    @PostMapping("/secure/post/message")
    public void saveMessage(@RequestBody Message messageRequest, Authentication authentication) {
        String userEmail = authentication.getName();
        messageService.saveMessage(messageRequest, userEmail);
    }


}
