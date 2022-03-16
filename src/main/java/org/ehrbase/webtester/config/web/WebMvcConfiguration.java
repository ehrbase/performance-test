package org.ehrbase.webtester.config.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * {@link Configuration} for Spring Web MVC.
 *
 * @author Renaud Subiger
 * @since 1.0
 */
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    /**
     * {@inheritDoc}
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");
    }
}
