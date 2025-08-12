package com.project.dto.product;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPostDto {
	
	@NotBlank
	private String name;
	
	@NotBlank
	private String description;
	
	@NotNull
	@Positive
	private Double price;
	
	@Positive
	private Long categoryId;
	
	@Positive
	private Long countryOfOriginId;
	private boolean auctionedForToday;
	@NotNull
	@Min(0)
	@Max(2025)
	private Long yearMade;
	private boolean sold;
//	@JsonIgnore
    private List<MultipartFile> imageFiles;

}
