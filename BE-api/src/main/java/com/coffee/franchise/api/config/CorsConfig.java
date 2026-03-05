package com.coffee.franchise.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // Cho phép tất cả các API
        .allowedOrigins("http://localhost:5173", "http://localhost:5174")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Cho phép các HTTP methods
        .allowedHeaders("*") // Cho phép tất cả các headers
        .allowCredentials(true); // Cho phép gửi cookie, authorization headers
  }
}
