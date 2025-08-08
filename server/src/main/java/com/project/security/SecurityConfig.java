package com.project.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration	// declare this class as a configuration class(dont do this in traditional way, do it in my way)
@EnableWebSecurity // enable the web security for application
public class SecurityConfig {
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean //declare method that returns Spring-managed bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	AuthenticationManager authenticationManager(HttpSecurity http) throws Exception{
		AuthenticationManagerBuilder authManagerBuilder= http.getSharedObject(AuthenticationManagerBuilder.class);
		authManagerBuilder.userDetailsService(userDetailsService);
		return authManagerBuilder.build();
	}
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();
	    config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
	    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    config.setAllowedHeaders(Arrays.asList("*"));
	    config.setAllowCredentials(true); // Allow cookies

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
	    return source;
	}

	

	@Bean
	SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception {
	    http
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(requests -> requests
	            .requestMatchers(
	                "/signin", 
	                "/signup",
	                "/verifyuser",
	                "/edit-profile",
	                "/get-user",
	                "/v3/api-docs/**", 
	                "/swagger-ui/**", 
	                "/swagger-ui.html"
	            ).permitAll()
	            .requestMatchers("/bidder/**").hasRole("BIDDER")
	            .requestMatchers("/manager/**").hasRole("MANAGER")
	            .requestMatchers("/auctioneer/**").hasRole("AUCTIONEER")
	            .anyRequest().authenticated()
	        )
	        .httpBasic(Customizer.withDefaults())
	        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

	    return http.build();
	}
	

//	@Bean
//	SecurityFilterChain authorizeRequests(HttpSecurity http) throws Exception{
//		http
//			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
//			.csrf(csrf-> csrf.disable())
//			.authorizeHttpRequests(requests-> requests
//				.requestMatchers("/signin").permitAll()
//				.requestMatchers("/register").permitAll()
//				.requestMatchers("/bidder/**").hasRole("BIDDER")
//				.requestMatchers("/manager/**").hasRole("MANAGER")
//				.requestMatchers("/auctioneer/**").hasRole("AUCTIONEER")
//				.anyRequest().authenticated())
//			.httpBasic(Customizer.withDefaults())
//			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//			.sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//			
//			return http.build();
//			
//			
//	}
	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for testing
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow ALL endpoints
            )
            .formLogin().disable()
            .httpBasic().disable(); // Disable default login forms (optional)

        return http.build();
    }
	
}
