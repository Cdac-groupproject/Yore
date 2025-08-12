package com.project.dto;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductDTO {
	private Long productId;
    private String name;
    private String description;
    private Double price;
    private Boolean sold;
    private String categoryId;
    private Long countryOfOriginId; 
    private Long yearMade;
    private boolean auctionedForToday;
    private List<String> imageUrl = new ArrayList<>();
    // For input: multipart image files (used in controller, not sent as JSON)
    @JsonIgnore
    private List<MultipartFile> imageFiles;
}
