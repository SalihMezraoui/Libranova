package com.libranova.spring_boot_library.configuration;

import com.libranova.spring_boot_library.model.Book;
import com.libranova.spring_boot_library.model.Message;
import com.libranova.spring_boot_library.model.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DataRestConfig implements RepositoryRestConfigurer
{
    private static final String FRONTEND_URL = "https://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration restConfig, CorsRegistry cors) {
        // HTTP methods to disable for entities to enforce read-only REST endpoints
        HttpMethod[] blockedMethods = {
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.PATCH,
                HttpMethod.DELETE
        };

        log.info("Exposing entity IDs for Book, Review, and Message.");
        restConfig.exposeIdsFor(Book.class, Review.class, Message.class);

        log.info("Disabling unsafe HTTP methods on Book entity.");
        restrictHttpMethodsForEntity(Book.class, restConfig, blockedMethods);

        log.info("Disabling unsafe HTTP methods on Review entity.");
        restrictHttpMethodsForEntity(Review.class, restConfig, blockedMethods);

        log.info("Disabling unsafe HTTP methods on Message entity.");
        restrictHttpMethodsForEntity(Message.class, restConfig, blockedMethods);

        // Configure CORS to accept requests only from the frontend origin
        log.info("Setting CORS mapping for frontend origin: {}", FRONTEND_URL);
        cors.addMapping(restConfig.getBasePath() + "/**")
                .allowedOrigins(FRONTEND_URL);
    }

    /**
     * Helper method to restrict HTTP methods for a specific domain entity.
     *
     * @param entityClass the domain entity class
     * @param config      RepositoryRestConfiguration instance
     * @param methods     HTTP methods to disable
     */
    private void restrictHttpMethodsForEntity(Class<?> entityClass,
                                              RepositoryRestConfiguration config,
                                              HttpMethod[] methods) {
        config.getExposureConfiguration()
                .forDomainType(entityClass)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(methods))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(methods));
        log.debug("Restricted HTTP methods {} for entity: {}", methods, entityClass.getSimpleName());
    }
}
