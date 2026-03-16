package com.saas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // No interceptors needed as tenant context is handled by JwtAuthenticationFilter
}
