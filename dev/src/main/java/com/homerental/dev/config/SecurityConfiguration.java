package com.homerental.dev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {
@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
 
        // Disable Cross Site Request Forgery
        http.csrf((csrf) -> csrf.disable());
 
        // Protect endpoints at /api/<type>/secure
        http.authorizeHttpRequests(configurer ->
                        configurer
                                .requestMatchers("/api/vehicleBookings/**")
                                .authenticated().anyRequest().permitAll())
                .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer.jwt(Customizer.withDefaults()));
 
 
        // Add CORS filters
        http.cors(Customizer.withDefaults());
 
        // Add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class,
                new HeaderContentNegotiationStrategy());
 
        // Force a non-empty response body for 401's to make the response friendly
        //Okta.configureResourceServer401ResponseBody(http);
        //Okta.configureResourceServer401ResponseBody(http);
        
        return http.build();
    }
}
