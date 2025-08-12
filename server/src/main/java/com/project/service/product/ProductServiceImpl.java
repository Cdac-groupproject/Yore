package com.project.service.product;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.FileStorageException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.AuctionDao;
import com.project.dao.product.CountryRefDao;
import com.project.dao.product.ProductCategoryDao;
import com.project.dao.product.ProductDao;
import com.project.dao.product.ProductImageDao;
import com.project.dto.ProductDTO;
import com.project.dto.product.CountryRefDto;
import com.project.dto.product.ProductCategoryDto;
import com.project.dto.product.ProductGetDto;
import com.project.dto.product.ProductPostDto;
import com.project.entity.CountryRef;
import com.project.entity.Product;
import com.project.entity.ProductCategory;
import com.project.entity.ProductImage;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
//@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

//    @Autowired
//    private final ProductDao productDao;
//
//    @Autowired
//    private final ProductCategoryDao categoryDao;
//
//    @Autowired
//    private final CountryRefDao countryDao;
//    
//    @Autowired
//    private final ProductImageDao productImageDao;
//    
//    @Value(value = "${app.product.image.upload-dir}")
//    private String uploadDir;
//
//    @Autowired
//    private ModelMapper modelMapper;
	private final ProductDao productDao;
    private final ProductCategoryDao categoryDao;
    private final CountryRefDao countryDao;
    private final ProductImageDao productImageDao;
    private final String uploadDir;
    private final AuctionDao auctionDao;
    private final ModelMapper modelMapper;

    public ProductServiceImpl(
        ProductDao productDao,
        AuctionDao auctionDao,
        ProductCategoryDao categoryDao,
        CountryRefDao countryDao,
        ProductImageDao productImageDao,
        @Value("${app.product.image.upload-dir}") String uploadDir,
        ModelMapper modelMapper
    ) {
        this.productDao = productDao;
        this.categoryDao = categoryDao;
        this.countryDao = countryDao;
        this.productImageDao = productImageDao;
        this.uploadDir = uploadDir;
        
        this.auctionDao=auctionDao;
        this.modelMapper = modelMapper;
    }

    @Override
    public Product addProduct(ProductPostDto productDTO) throws IOException {
    	
    	ProductCategory productCategory = categoryDao.findById(productDTO.getCategoryId())
    			.orElseThrow(() -> new RuntimeException("Invalid Category Id"));

    	CountryRef countryOfOrigin = countryDao.findById(productDTO.getCountryOfOriginId())
    			.orElseThrow(() -> new RuntimeException("Invalid Country id"));
    	
    	Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setYearMade(productDTO.getYearMade());
        product.setCategory(productCategory);
        product.setCountryOfOrigin(countryOfOrigin);
       product.setAuctionedForToday(false);
        // we are saving the product first to give product a id for further use
        Product savedProduct = productDao.save(product);
        List<ProductImage> productImages = new ArrayList<>();
        
        if(productDTO.getImageFiles() != null && !productDTO.getImageFiles().isEmpty()) {
        	for(MultipartFile file : productDTO.getImageFiles()) {
        		if(!file.isEmpty()) {
        			String uploadedFileName = file.getOriginalFilename();
        			String uniqueFileName = UUID.randomUUID().toString() + "_" + uploadedFileName;
        			File dir = new File(uploadDir);
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }
                    String filePath = uploadDir + File.separator + uniqueFileName;
                    Files.copy(file.getInputStream(), Paths.get(filePath));
                    
                    ProductImage img = new ProductImage();

                    img.setImgUrl(filePath);
                    img.setProduct(savedProduct);
                    productImages.add(img);
        		}
        	}
        	productImageDao.saveAll(productImages);
        }
        return savedProduct;
    }

    @Override
    public ProductGetDto getProductById(Long id) {
        Product product = productDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        ProductGetDto dto = modelMapper.map(product, ProductGetDto.class);
        
        if(product.getCategory() != null) {
        	ProductCategoryDto productCategoryDto = new ProductCategoryDto();
        	productCategoryDto.setCategoryId(product.getCategory().getCategoryId());
        	productCategoryDto.setName(product.getCategory().getName());
        	dto.setCategory(productCategoryDto);
        }
        
        if(product.getCountryOfOrigin() != null) {
        	CountryRefDto countryDto = new CountryRefDto();
        	countryDto.setCountryId(product.getCountryOfOrigin().getCountryId());
        	countryDto.setCountryName(product.getCountryOfOrigin().getCountryName());
        	dto.setCountryOfOrigin(countryDto);
        }
        
        if(product.getImageList() != null) {
        	dto.setImageUrl(product.getImageList().stream()
        			.map(img -> img.getImgUrl().replace("\\", "/"))
        			.toList());
        }
        return dto;

    }

    @Override
    public List<ProductGetDto> getAllProducts() {
    	List<Product> allProducts = productDao.findAll();
    	
    	return allProducts.stream().map(product -> {
    		ProductGetDto dto = modelMapper.map(product, ProductGetDto.class);

            // Map category
            if (product.getCategory() != null) {
                ProductCategoryDto categoryDto = new ProductCategoryDto();
                categoryDto.setCategoryId(product.getCategory().getCategoryId());
                categoryDto.setName(product.getCategory().getName());
                dto.setCategory(categoryDto);
            }

            // Map country of origin
            if (product.getCountryOfOrigin() != null) {
                CountryRefDto countryDto = new CountryRefDto();
                countryDto.setCountryId(product.getCountryOfOrigin().getCountryId());
                countryDto.setCountryName(product.getCountryOfOrigin().getCountryName());
                dto.setCountryOfOrigin(countryDto);
            }
            if (product.getImageList() != null) {
                dto.setImageUrl(
                    product.getImageList()
                           .stream()
                           .map(image -> image.getImgUrl().replace("\\", "/")) 
                           .toList());
            }
            return dto; 
    	}).toList();
    }

//    @Override
//    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
//        Product product = productDao.findById(productId)
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
//
//        product.setName(productDTO.getName());
//        product.setDescription(productDTO.getDescription());
//        product.setPrice(productDTO.getPrice());
//        product.setSold(productDTO.getSold());
//        product.setYearMade(productDTO.getYearMade());
//
//        ProductCategory category = categoryDao.findById(Long.valueOf(productDTO.getCategoryId()))
//                .orElseThrow(() -> new ApiException("Invalid Category ID"));
//        CountryRef country = countryDao.findById(productDTO.getCountryOfOriginId())
//                .orElseThrow(() -> new ApiException("Invalid Country ID"));
//
//        product.setCategory(category);
//        product.setCountryOfOrigin(country);
//
//        List<ProductImage> updatedImages = productDTO.getImageUrl().stream()
//                .map(url -> {
//                    ProductImage img = new ProductImage();
//                    img.setImgUrl(url);
//                    img.setProduct(product);
//                    return img;
//                })
//                .collect(Collectors.toList());
//        product.getImageList().clear();
//        product.getImageList().addAll(updatedImages);
//
//        Product saved = productDao.save(product);
//
//        ProductDTO dto = modelMapper.map(saved, ProductDTO.class);
//        dto.setPrice(saved.getPrice());
//        dto.setCategoryId(saved.getCategory().getCategoryId().toString());
//        dto.setCountryOfOriginId(saved.getCountryOfOrigin().getCountryId());
//        dto.setImageUrl(saved.getImageList().stream()
//                .map(ProductImage::getImgUrl)
//                .collect(Collectors.toList()));
//        return dto;
//    }
    
    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductPostDto productDTO) {
        Product product = productDao.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        // Basic field updates
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setYearMade(productDTO.getYearMade());
        product.setSold(productDTO.isSold());
        product.setAuctionedForToday(productDTO.isAuctionedForToday());
        // Update category
        ProductCategory productCategory = categoryDao.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid Category Id"));
        product.setCategory(productCategory);

        // Update country of origin
        CountryRef countryOfOrigin = countryDao.findById(productDTO.getCountryOfOriginId())
                .orElseThrow(() -> new RuntimeException("Invalid Country id"));
        product.setCountryOfOrigin(countryOfOrigin);

        // Handle images if provided
        if (productDTO.getImageFiles() != null && !productDTO.getImageFiles().isEmpty()) {
            try {
                // Clear existing list (keeping same instance)
                product.getImageList().clear();

                // Save new images
                for (MultipartFile file : productDTO.getImageFiles()) {
                    if (!file.isEmpty()) {
                        String uploadedFileName = file.getOriginalFilename();
                        String uniqueFileName = UUID.randomUUID().toString() + "_" + uploadedFileName;

                        File dir = new File(uploadDir);
                        if (!dir.exists()) dir.mkdirs();

                        String filePath = uploadDir + File.separator + uniqueFileName;
                        Files.copy(file.getInputStream(), Paths.get(filePath));

                        ProductImage img = new ProductImage();
                        img.setImgUrl(filePath);
                        img.setProduct(product);
                        product.getImageList().add(img); // add to same list
                    }
                }

            } catch (IOException e) {
                throw new FileStorageException("Could not store file. Please try again!", e);
            }
        }

        Product saved = productDao.save(product);

        // Convert to DTO
        ProductDTO dto = modelMapper.map(saved, ProductDTO.class);
        dto.setPrice(saved.getPrice());
        dto.setCategoryId(saved.getCategory().getCategoryId().toString());
        dto.setCountryOfOriginId(saved.getCountryOfOrigin().getCountryId());
        dto.setImageUrl(saved.getImageList().stream()
                .map(ProductImage::getImgUrl)
                .collect(Collectors.toList()));

        return dto;
    }




    @Override
    public void deleteProduct(Long productId) {
        Product product = productDao.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        if (auctionDao.existsByProduct(product)) {
            throw new ApiException("Cannot delete product as it is referenced in auctions.");
        }
        productDao.delete(product);
    }

	@Override
	public void markProductAsAuctioned(Long productId) {
		Product product = productDao.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("No product with this id found"));
		product.setAuctionedForToday(true);
		productDao.save(product);
	}

	@Override
	public List<ProductGetDto> getAllProductsMarkedForAuction() {
		// TODO Auto-generated method stub
		List<Product> products = productDao.findByAuctionedForTodayTrue();
		return products.stream().map(product -> {
    		ProductGetDto dto = modelMapper.map(product, ProductGetDto.class);

            // Map category
            if (product.getCategory() != null) {
                ProductCategoryDto categoryDto = new ProductCategoryDto();
                categoryDto.setCategoryId(product.getCategory().getCategoryId());
                categoryDto.setName(product.getCategory().getName());
                dto.setCategory(categoryDto);
            }

            // Map country of origin
            if (product.getCountryOfOrigin() != null) {
                CountryRefDto countryDto = new CountryRefDto();
                countryDto.setCountryId(product.getCountryOfOrigin().getCountryId());
                countryDto.setCountryName(product.getCountryOfOrigin().getCountryName());
                dto.setCountryOfOrigin(countryDto);
            }
            if (product.getImageList() != null) {
                dto.setImageUrl(
                    product.getImageList()
                           .stream()
                           .map(image -> image.getImgUrl().replace("\\", "/")) 
                           .toList());
            }
            return dto; 
    	}).toList();
	}

}
