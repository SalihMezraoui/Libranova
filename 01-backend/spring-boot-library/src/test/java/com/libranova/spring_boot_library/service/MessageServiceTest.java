package com.libranova.spring_boot_library.service;

import com.libranova.spring_boot_library.Repository.MessageRepository;
import com.libranova.spring_boot_library.dto.request.QuestionRequest;
import com.libranova.spring_boot_library.model.Message;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageService messageService;

    private Message message;
    private QuestionRequest questionRequest;

    @BeforeEach
    void setUp() {
        message = Message.builder()
                .id(1L)
                .subject("Test Subject")
                .inquiry("Test Inquiry")
                .userEmail("user@example.com")
                .build();

        questionRequest = new QuestionRequest();
        questionRequest.setId(1L);
        questionRequest.setResponse("Test Response");
    }

    @Test
    void submitMessage_savesMessage() {
        Message request = Message.builder()
                .subject("Test Subject")
                .inquiry("Test Inquiry")
                .build();

        messageService.submitMessage(request, "user@example.com");

        verify(messageRepository).save(argThat(saved ->
                saved.getSubject().equals("Test Subject")
                        && saved.getInquiry().equals("Test Inquiry")
                        && saved.getUserEmail().equals("user@example.com")
        ));
    }

    @Test
    void updateMessageResponse_successful() {
        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        messageService.updateMessageResponse(questionRequest, "admin@example.com");

        verify(messageRepository).save(argThat(updated ->
                updated.getAdminEmail().equals("admin@example.com")
                        && updated.getResponse().equals("Test Response")
                        && updated.isAnswered()
        ));
    }

    @Test
    void updateMessageResponse_messageNotFound_throwsException() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> messageService.updateMessageResponse(questionRequest, "admin@example.com"));

        verify(messageRepository, never()).save(any());
    }
}
