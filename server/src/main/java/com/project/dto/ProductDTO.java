package com.project.dto;

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
    private String category;
    private String imageUrl;
}
