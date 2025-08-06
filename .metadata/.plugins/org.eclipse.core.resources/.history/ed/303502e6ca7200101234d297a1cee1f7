//package com.project.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
//
//@Configuration
////@EnableWebSecurity
//public class SecurityConfig {
//	@Bean
//	public PasswordEncoder passwordEncoder() {
//		return new BCryptPasswordEncoder();
//	}
//	
//	@Bean
//	public CorsConfigurationSource corsConfigurationSource() {
//	    CorsConfiguration configuration = new CorsConfiguration();
//	    configuration.setAllowCredentials(true);
//	    configuration.addAllowedOriginPattern("*"); // or use specific domains like "http://localhost:3000"
//	    configuration.addAllowedHeader("*");
//	    configuration.addAllowedMethod("*");
//
//	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//	    source.registerCorsConfiguration("/**", configuration);
//	    return (CorsConfigurationSource) source;
//	}
//
//	
//	@Bean
//	SecurityFilterChain configureFilterChain(HttpSecurity http) throws Exception {
//		
//		http.csrf(csrf -> csrf.disable());
//		http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
//		
//		http.authorizeHttpRequests(
//
//				request -> request
//				.requestMatchers("/swagger-ui/**",
//						"/v3/api-docs/**", "/users/signin", "/users/signup")
//						.permitAll()
//				.requestMatchers(HttpMethod.GET, "/restaurants")
//				.permitAll()
//				.requestMatchers(HttpMethod.POST, "/restaurants")
//				.hasRole("ADMIN")
//				.anyRequest()
//					.authenticated());
//		
//		http.sessionManagement(session -> 
//		session.sessionCreationPolicy
//		(SessionCreationPolicy.STATELESS));
//		
//		http.formLogin(form -> form.disable());
//		
//		http.httpBasic(Customizer.withDefaults());
//		return http.build();
//	}
//    
//}
