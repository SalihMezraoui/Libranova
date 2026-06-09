package com.libranova.spring_boot_library.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.libranova.spring_boot_library.config.TestSecurityConfig;
import com.libranova.spring_boot_library.dto.request.QuestionRequest;
import com.libranova.spring_boot_library.model.Message;
import com.libranova.spring_boot_library.service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MessageController.class)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = "frontend.url=http://localhost:3000")
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MessageService messageService;

    private static final String USER_EMAIL  = "user@example.com";
    private static final String ADMIN_EMAIL = "admin@example.com";

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor userJwt() {
        return jwt().jwt(j -> j.subject(USER_EMAIL));
    }

    private org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor adminJwt() {
        return jwt().jwt(j -> j.subject(ADMIN_EMAIL).claim("https://libranova.com/userType", "admin"));
    }

    @Test
    void saveMessage_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/messages/secure/post/message")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void saveMessage_authenticated_returns200() throws Exception {
        Message message = new Message();
        message.setSubject("Help");
        message.setInquiry("Where is my book?");

        mockMvc.perform(post("/api/messages/secure/post/message")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(message))
                        .with(userJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(messageService).submitMessage(any(Message.class), eq(USER_EMAIL));
    }

    @Test
    void answerMessage_asAdmin_returns200() throws Exception {
        QuestionRequest request = new QuestionRequest();
        request.setId(1L);
        request.setResponse("Your book is ready.");

        mockMvc.perform(put("/api/messages/secure/admin/answer/message")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(adminJwt()).with(csrf()))
                .andExpect(status().isOk());

        verify(messageService).updateMessageResponse(any(QuestionRequest.class), eq(ADMIN_EMAIL));
    }

    @Test
    void answerMessage_asNonAdmin_returns403() throws Exception {
        QuestionRequest request = new QuestionRequest();
        request.setId(1L);
        request.setResponse("Attempt.");

        mockMvc.perform(put("/api/messages/secure/admin/answer/message")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(userJwt()).with(csrf()))
                .andExpect(status().isForbidden());
    }
}
