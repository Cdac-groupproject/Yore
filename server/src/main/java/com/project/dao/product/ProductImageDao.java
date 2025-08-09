package com.project.dao.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.entity.Auction;
import com.project.entity.ProductImage;

public interface ProductImageDao extends JpaRepository<ProductImage, Integer> {
	@Query("select a from Auction a " +
		       "left join fetch a.product p " +
		       "left join fetch p.imageList img " +
		       "left join fetch a.auctioneer " +
		       "left join fetch a.winner " +
		       "where a.auctionId = :id")
		Optional<Auction> findByIdWithProductAndImages(@Param("id") Long id);
	@Query("select pi.product.productId, pi.imgUrl from ProductImage pi where pi.product.productId in :productIds order by pi.product.productId, pi.imageId")
List<Object[]> findProductIdAndImageUrlByProductIds(@Param("productIds") List<Long> productIds);
}
