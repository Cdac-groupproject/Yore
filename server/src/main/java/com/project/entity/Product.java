package com.project.entity;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "product_id")
	private Long productId;

	@Column(nullable = false)
	private String name;
	private String description;
	private Double price;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "product_category" , referencedColumnName = "category_id")
	private ProductCategory category;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "country_of_origin" , referencedColumnName = "country_id")
	private CountryRef countryOfOrigin;

	@Column(name = "year_made")
	private Long yearMade;

	@Column(name = "auctioned_for_today")
	private Boolean auctionedForToday = false;
	private Boolean sold = false;
	
	@OneToMany(mappedBy = "product" , cascade = CascadeType.ALL , orphanRemoval = true)
	private List<ProductImage> imageList = new ArrayList<ProductImage>();
	 
	@Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

	public Product(Long productId, String name, String description, Double price, ProductCategory category,
			CountryRef countryOfOrigin, Long yearMade, Boolean auctionedForToday, Boolean sold) {
		this.productId = productId;
		this.name = name;
		this.description = description;
		this.price = price;
		this.category = category;
		this.countryOfOrigin = countryOfOrigin;
		this.yearMade = yearMade;
		this.auctionedForToday = auctionedForToday;
		this.sold = sold;
	}
       

}
