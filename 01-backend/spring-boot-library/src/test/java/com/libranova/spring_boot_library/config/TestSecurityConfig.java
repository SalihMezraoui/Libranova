package com.libranova.spring_boot_library.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.BadJwtException;

@TestConfiguration
public class TestSecurityConfig {

    @Bean
    public JwtDecoder jwtDecoder() {
        // Never called in tests — jwt() post processor bypasses the decoder entirely.
        // Provided so Spring Boot does not try to auto-configure a real one (which would
        // attempt a network call to the Auth0 issuer URI).
        return token -> { throw new BadJwtException("Test context — real decoder not available"); };
    }
}
