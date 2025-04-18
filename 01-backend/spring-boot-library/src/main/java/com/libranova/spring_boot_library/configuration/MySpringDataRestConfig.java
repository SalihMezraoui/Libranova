package com.libranova.spring_boot_library.configuration;

import com.libranova.spring_boot_library.model.Book;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MySpringDataRestConfig implements RepositoryRestConfigurer
{
    private String allowedFrontendOrigin = "http://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry corsRegistry) {
        HttpMethod [] unSupportedActions = {HttpMethod.POST, HttpMethod.PATCH, HttpMethod.DELETE, HttpMethod.PUT};

        config.exposeIdsFor(Book.class);

        restrictHttpMethods(Book.class, config, unSupportedActions);

        // CORS mapping configuaration
        corsRegistry.addMapping(config.getBasePath() + "/**").allowedOrigins(allowedFrontendOrigin);
    }

    private void restrictHttpMethods(Class domainClass, RepositoryRestConfiguration config, HttpMethod[] restrictedMethods)
    {
        config.getExposureConfiguration()
                .forDomainType(domainClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(restrictedMethods)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(restrictedMethods));
    }
}
