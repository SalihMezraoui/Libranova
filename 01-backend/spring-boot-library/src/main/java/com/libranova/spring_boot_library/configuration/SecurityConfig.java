package com.libranova.spring_boot_library.configuration;

import com.okta.spring.boot.oauth.Okta;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig
{
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(configurer -> configurer
                        .requestMatchers("/api/books/secure/**"
                        , "/api/reviews/secure/**"
                        , "/api/messages/secure/**"
                        , "/api/admin/secure/**").authenticated()
                        .anyRequest().permitAll()
                        //.anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());
        Okta.configureResourceServer401ResponseBody(http);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from the React frontend running on localhost:3000
        configuration.setAllowedOriginPatterns(List.of("https://localhost:3000"));

        // Allow all HTTP methods
        configuration.setAllowedMethods(List.of("GET", "PUT", "POST", "DELETE", "OPTIONS"));

        // Allow all headers
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Allow credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);

        // Expose headers to the client
        configuration.setExposedHeaders(List.of("Authorization"));

        // Register the CORS configuration for all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
