package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.MessageRepository;
import com.libranova.spring_boot_library.dto.request.QuestionRequest;
import com.libranova.spring_boot_library.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class MessageService
{
    private final MessageRepository messageRepository;

    public void saveMessage(Message messageRequest, String userEmail){
        Message message = Message.builder()
                .subject(messageRequest.getSubject())
                .inquiry(messageRequest.getInquiry())
                .userEmail(userEmail)
                .build();
        messageRepository.save(message);
    }

    public void updateMessageResponse(QuestionRequest questionRequest, String userEmail){
        Message message = messageRepository.findById(questionRequest.getId())
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + questionRequest.getId()));

        message.setAdminEmail(userEmail);
        message.setResponse(questionRequest.getResponse());
        message.setClosed(true);
        messageRepository.save(message);
    }

}
