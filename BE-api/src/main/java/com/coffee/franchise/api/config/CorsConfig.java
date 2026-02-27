package com.coffee.franchise.api.config;

import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration config = new CorsConfiguration();

       config.setAllowedOrigins(List.of("http://localhost:5173"));

       config.setAllowedMethods(List.of("*"));

       config.setAllowCredentials(true);

       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

       source.registerCorsConfiguration("/**", config);

       return source;
    }
}
