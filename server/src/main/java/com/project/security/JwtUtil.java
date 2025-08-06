package com.project.security;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import com.project.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component // marks class as a spring bean i.e., DI can be done
public class JwtUtil {
	@Value(value="${jwt.token.expiration.millis}") //takes the value from application.properties
	public long jwtExpiration;
	@Value(value = "${jwt.token.secret}")
	public String jwtSecret;
	private Key jwtKey;
	
	@PostConstruct // to run the method after @Value is set
	public void init() {
		jwtKey=Keys.hmacShaKeyFor(jwtSecret.getBytes()); //string secret --> secure HMAC key for signing jwt's	
	}
	
	public String createToken(Authentication auth) {
		User user= (User) auth.getPrincipal();
		String subject= "" +user.getUserId();
		String roles= user.getAuthorities().stream()
						.map(authority->authority.getAuthority())
						.collect(Collectors.joining(","));
		
		String token = Jwts.builder()
				.setSubject(subject)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
				.claim("role", roles) // this is payload that contains all data stored in jwt
				.signWith(jwtKey , SignatureAlgorithm.HS256)
				.compact(); // returns jwt as a String
		return token;
	}
	
	public Authentication validateToken(String token) {
		JwtParser parser= Jwts.parserBuilder().setSigningKey(jwtKey).build();
		Claims claims= parser
				.parseClaimsJws(token)
				.getBody();
		String userId= claims.getSubject();
		String roles= (String) claims.get("role");
		List<GrantedAuthority> authorities= AuthorityUtils.commaSeparatedStringToAuthorityList(roles);
		return new UsernamePasswordAuthenticationToken(userId, null , authorities); //the params : userid= principal-->null=
																					//credentials(dont want password in token
																					//authorities= roles this object passed to 
																					//Spring sec. ctxt. user authenticated
		
	}
}
