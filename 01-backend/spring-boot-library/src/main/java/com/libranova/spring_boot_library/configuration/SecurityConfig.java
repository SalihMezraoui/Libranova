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
    @Bean // Declares that the returned object (SecurityFilterChain) will be managed by Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disables CSRF protection for simplicity, since this is a stateless API, since my app
                // does not use cookies or sessions, and is not vulnerable to CSRF attacks.
                // the app uses OAuth2 tokens for authentication, which are not vulnerable to CSRF.
                .csrf(csrf -> csrf.disable())
                // Configure authorization rules
                .authorizeHttpRequests(configurer -> configurer
                        // Require authentication for these "secure" paths
                        .requestMatchers("/api/books/secure/**"
                        , "/api/reviews/secure/**"
                        , "/api/messages/secure/**"
                        , "/api/admin/secure/**"
                        , "/api/payments/secure/**").authenticated()
                        // All other requests are allowed without authentication
                        .anyRequest().permitAll()
                )
                // Enable OAuth2 Resource Server with JWT validation
                // This is how Spring checks tokens issued by Okta
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))

                // Enable CORS using our custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // Ensure Spring uses HTTP header-based content negotiation
        // This tells Spring how to decide whether to return JSON, XML, etc.
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Configure Okta-specific 401 response body (for unauthenticated requests)
        Okta.configureResourceServer401ResponseBody(http);

        // Build and return the security filter chain
        return http.build();
    }

    @Bean // Declare a bean for CORS configuration
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
