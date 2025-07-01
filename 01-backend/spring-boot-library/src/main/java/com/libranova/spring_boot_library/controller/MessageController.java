package com.libranova.spring_boot_library.controller;

import com.libranova.spring_boot_library.dto.request.QuestionRequest;
import com.libranova.spring_boot_library.model.Message;
import com.libranova.spring_boot_library.service.MessageService;
import com.libranova.spring_boot_library.utils.RetrieveJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

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

    @PutMapping("/secure/admin/message")
    public void updateMessageResponse(@RequestBody QuestionRequest questionRequest, Authentication authentication) throws AccessDeniedException {
        String userEmail = authentication.getName();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            String admin = jwtAuth.getToken().getClaim("userType");

            if (admin == null || !admin.equals("admin")) {
                throw new AccessDeniedException("Unauthorized access: Only admins can update messages.");
            }

            messageService.updateMessageResponse(questionRequest, userEmail);
        } else {
            throw new AccessDeniedException("Unauthorized: Invalid token type.");
        }
    }



}
