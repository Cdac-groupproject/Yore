package com.project.dto.product;

import java.util.List;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductGetDto {
	private Long productId;
	private String name;
	private String description;
	private Double price;
	private ProductCategoryDto category;
	private CountryRefDto countryOfOrigin;
	private Long yearMade;
	private Boolean auctionedForToday;
	private Boolean sold;
	private List<String> imageUrl;
}
