package com.libranova.spring_boot_library.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
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
                // Stateless API — no sessions or cookies, so CSRF is not a concern
                .csrf(csrf -> csrf.disable())
                // Authorization rules
                .authorizeHttpRequests(configurer -> configurer
                        .requestMatchers("/api/books/secure/**"
                        , "/api/reviews/secure/**"
                        , "/api/messages/secure/**"
                        , "/api/admin/secure/**"
                        , "/api/payments/secure/**").authenticated()
                        .anyRequest().permitAll()
                )
                // Validate JWTs issued by Auth0; use our converter so getName() returns the user's email
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        return http.build();
    }

    /**
     * Maps the https://libranova.com/username claim (injected by the Auth0 Action) to the
     * Spring Security principal name, so authentication.getName() returns the user's email
     * instead of Auth0's internal sub claim (e.g. auth0|abc123).
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setPrincipalClaimName("https://libranova.com/username");
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("https://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "PUT", "POST", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
