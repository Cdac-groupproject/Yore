package com.project.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.project.dto.product.CountryRefDto;
import com.project.entity.CountryRef;
import com.project.service.product.ProductService;
import com.project.service.product.required.CountryRefService;

import io.swagger.v3.oas.annotations.Operation;
import jdk.jfr.Description;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@Validated
public class CountryRefController {
	
	public final CountryRefService countryService ;
	
	@GetMapping("/getAllCountries")
	@Operation(description = "get all country lists")
	public ResponseEntity<List<CountryRefDto>> getAllCountries(){
		List<CountryRefDto> allCountries = countryService.getAllCountries();
		if(allCountries.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(allCountries);
	}
	
	@PostMapping("/manager/addCountry")
	@Operation(description = "add a country")
	public ResponseEntity<CountryRef> addCountry(@RequestBody CountryRefDto countryRefDto)throws IOException{
		return ResponseEntity.status(HttpStatus.CREATED).body(countryService.addCountryRef(countryRefDto));
	}
	
}
