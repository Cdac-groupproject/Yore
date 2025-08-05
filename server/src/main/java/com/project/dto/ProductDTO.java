package com.project.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductDTO {
	private Long productId;
    private String name;
    private String description;
    private Double startingPrice;
    private Boolean sold;
    private String categoryId;
    private Long countryOfOriginId; 
    private Long yearMade;
    private List<String> imageUrl;;
}
