package com.project.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.AuctionDao;
import com.project.dao.BidDao;
import com.project.dao.UserDao;
import com.project.dao.orders.OrdersDao;
import com.project.dao.product.ProductDao;
import com.project.dao.product.ProductImageDao;
import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionCloseResponseDTO;
import com.project.dto.AuctionRespDTO;
import com.project.dto.ProductDTO;
import com.project.dto.events.AuctionEvent;
import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.Order;
import com.project.entity.Product;
import com.project.entity.ProductImage;
import com.project.entity.User;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    private final AuctionDao auctionDao;
    private final ProductDao productDao;
    private final UserDao userDao;
    private final BidDao bidDao;
    private final ProductImageDao productImageDao;
    private final OrdersDao orderDao;
    private final ModelMapper modelMapper;
    private final SimpMessagingTemplate messagingTemplate;
    @Override
    public ApiResponse addNewAuction(AddAuctionDTO dto) {
        Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new ApiException("Invalid Product ID"));

        User auctioneer = userDao.findById(dto.getAuctioneerId())
                .orElseThrow(() -> new ApiException("Invalid Auctioneer ID"));
        if (auctionDao.existsByProduct(product)) {
            throw new ApiException("Auction already exists for this product.");
        }
        if (Boolean.TRUE.equals(product.getSold())) {
            throw new ApiException("Product is already sold.");
        }

        

        LocalDateTime start = dto.getStartTime() != null ? dto.getStartTime() : LocalDateTime.now();
        LocalDateTime end;

        if (dto.getEndTime() != null) {
            end = dto.getEndTime();
        } else if (dto.getDurationMinutes() != null) {
            end = start.plusMinutes(dto.getDurationMinutes());
        } else {
            throw new ApiException("Either endTime or durationMinutes must be provided.");
        }

        if (!end.isAfter(start)) {
            throw new ApiException("End time must be after start time.");
        }

        product.setUpdatedAt(LocalDateTime.now());
        productDao.save(product);

        Auction entity = modelMapper.map(dto, Auction.class);
        entity.setAuctioneer(auctioneer);
        entity.setProduct(product);
        entity.setStartTime(start);
        entity.setEndTime(end);
        entity.setWinner(null);
        entity.setBasePrice(dto.getBasePrice());
        entity.setIsClosed(false);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        Auction persistentAuction = auctionDao.save(entity);
        
     // If auction starts now or in the past, notify subscribers immediately (START)
        LocalDateTime now = LocalDateTime.now();
     
            AuctionEvent statusEvent = new AuctionEvent(
                    "START",
                    persistentAuction.getAuctionId(),
                    persistentAuction.getStartTime(),
                    persistentAuction.getEndTime(),
                    persistentAuction.getBasePrice(),
                    persistentAuction.getBasePrice(),// at start, no bids yet
                    //persistentAuction.getProduct(),
                    persistentAuction.getAuctioneer()
            );
            messagingTemplate.convertAndSend("/topic/auction", statusEvent);
            System.out.println("📢 Sending START event to /topic/auction");
            System.out.println("START event payload: " + statusEvent);



        return new ApiResponse("Added new Auction with ID=" + persistentAuction.getAuctionId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuctionRespDTO> getAllAuctions() {
        List<Auction> auctions = auctionDao.findAll();
        if (auctions == null || auctions.isEmpty()) return Collections.emptyList();

        // 1) Collect distinct productIds for all auctions (skip null products)
        List<Long> productIds = auctions.stream()
                .map(Auction::getProduct)
                .filter(Objects::nonNull)
                .map(Product::getProductId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        // 2) Query all image rows for these productIds in ONE DB call
        Map<Long, List<String>> imagesByProduct = new HashMap<>();
        if (!productIds.isEmpty()) {
            List<Object[]> rows = productImageDao.findProductIdAndImageUrlByProductIds(productIds);
            for (Object[] row : rows) {
                // row[0] -> productId, row[1] -> imgUrl
                Long pid = ((Number) row[0]).longValue();
                String url = (String) row[1];
                imagesByProduct.computeIfAbsent(pid, k -> new ArrayList<>()).add(url);
            }
        }

        // 3) Map auctions -> DTOs, pulling image list from the map (no further DB calls)
        return auctions.stream()
                .map(auction -> {
                    if (auction == null) return null;

                    Product product = auction.getProduct();
                    User auctioneer = auction.getAuctioneer();
                    User winner = auction.getWinner();

                    Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);

                    Optional<Bid> winningBidOpt = Optional.empty();
                    if (winner != null) {
                        winningBidOpt = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
                    }

                    Double highestBidAmount = highestBidOpt.map(Bid::getBidAmount).orElse(auction.getBasePrice());
                    Double winningBidAmount = winningBidOpt.map(Bid::getBidAmount).orElse(null);

                    // fetch images for this product from the prebuilt map
                    List<String> productImages = Collections.emptyList();
                    if (product != null) {
                        productImages = imagesByProduct.getOrDefault(product.getProductId(), Collections.emptyList());
                    }

                    return AuctionRespDTO.builder()
                            .auctionId(auction.getAuctionId())
                            .startTime(auction.getStartTime())
                            .endTime(auction.getEndTime())
                            .isClosed(auction.getIsClosed())
                            .createdAt(auction.getCreatedAt())
                            .updatedAt(auction.getUpdatedAt())

                            // product
                            .productId(product != null ? product.getProductId() : null)
                            .productName(product != null ? product.getName() : null)
                            .description(product != null ? product.getDescription() : null)
                            .countryOfOrigin(product != null && product.getCountryOfOrigin() != null
                                    ? product.getCountryOfOrigin().getCountryName()
                                    : null)
                            .productImages(productImages) // <-- NEW: multiple image URLs

                            // auctioneer
                            .auctioneerId(auctioneer != null ? auctioneer.getUserId() : null)
                            .auctioneerName(auctioneer != null ? auctioneer.getFullName() : null)

                            // winner
                            .winnerId(winner != null ? winner.getUserId() : null)
                            .winnerName(winner != null ? winner.getFullName() : null)
                            .winningBidAmount(winningBidAmount)

                            // monetary
                            .basePrice(auction.getBasePrice())
                            .currentHighestBid(highestBidAmount)

                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AuctionRespDTO getAuctionDetails(@Min(1) @Max(100) Long auctionId) {
        // 1. Fetch auction
        Auction auction = auctionDao.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Auction ID"));

        // 2. Initialize response DTO and basic fields
        AuctionRespDTO dto = new AuctionRespDTO();
        dto.setAuctionId(auction.getAuctionId());
        dto.setStartTime(auction.getStartTime());
        dto.setEndTime(auction.getEndTime());
        dto.setBasePrice(auction.getBasePrice());
        dto.setIsClosed(auction.getIsClosed());
        dto.setCreatedAt(auction.getCreatedAt());
        dto.setUpdatedAt(auction.getUpdatedAt());

        // 3. Product details (null-safe)
        Product product = auction.getProduct();
        if (product != null) {
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getName());
            dto.setDescription(product.getDescription());
            if (product.getCountryOfOrigin() != null) {
                dto.setCountryOfOrigin(product.getCountryOfOrigin().getCountryName());
            }

            // --- NEW: extract all image URLs from Product.imageList ---
            List<String> productImages = Collections.emptyList();
            if (product.getImageList() != null && !product.getImageList().isEmpty()) {
                productImages = product.getImageList().stream()
                        .map(pi -> pi.getImgUrl())     // uses your ProductImage.imgUrl
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
            dto.setProductImages(productImages);
        } else {
            dto.setProductImages(Collections.emptyList());
        }

        // 4. Auctioneer details (null-safe)
        User auctioneer = auction.getAuctioneer();
        if (auctioneer != null) {
            dto.setAuctioneerId(auctioneer.getUserId());
            dto.setAuctioneerName(auctioneer.getFullName());
        }

        // 5. Bids: winning or current highest (unchanged)
        if (auction.getWinner() != null) {
            User winner = auction.getWinner();
            dto.setWinnerId(winner.getUserId());
            dto.setWinnerName(winner.getFullName());

            Optional<Bid> winningBidOpt = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
            Double winningBidAmount = winningBidOpt.map(Bid::getBidAmount).orElse(null);
            dto.setWinningBidAmount(winningBidAmount);

            Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
            Double highestBidAmount = highestBidOpt.map(Bid::getBidAmount)
                    .orElse(auction.getBasePrice());
            dto.setCurrentHighestBid(highestBidAmount);

        } else {
            Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
            dto.setCurrentHighestBid(highestBidOpt.map(Bid::getBidAmount).orElse(auction.getBasePrice()));
            dto.setWinningBidAmount(null);
        }

        return dto;
    }
//    @Override
//    public AuctionCloseResponseDTO closeAuction(Long id) {
//        Auction auction = auctionDao.findById(id)
//                .orElseThrow(() -> new ApiException("Auction not found"));
//
//        if (Boolean.TRUE.equals(auction.getIsClosed())) {
//            throw new ApiException("Auction already closed");
//        }
//
//        Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
//
//        String winnerName = null;
//        Double winningBidAmount = null;
//
//        if (highestBidOpt.isPresent()) {
//            Bid highestBid = highestBidOpt.get();
//
//            // Set winner
//            User winner = highestBid.getBidder();
//            auction.setWinner(winner);
//
//            winnerName = winner != null ? winner.getFullName() : "Unknown";
//            winningBidAmount = highestBid.getBidAmount() != null ? highestBid.getBidAmount() : 0.0;
//
//            // Mark product as sold
//            Product product = auction.getProduct();
//            if (product != null) {
//                product.setSold(true);
//                productDao.save(product);
//            }
//        }
//
//        // Close the auction
//        auction.setIsClosed(true);
//        auction.setUpdatedAt(LocalDateTime.now());
//        auctionDao.save(auction);
//
//        String message = highestBidOpt
//                .map(b -> String.format("Auction closed successfully.\nWinner: %s\nWinning Bid: ₹%.2f",
//                        b.getBidder() != null ? b.getBidder().getFullName() : "Unknown",
//                        b.getBidAmount() != null ? b.getBidAmount() : 0.0))
//                .orElse("Auction closed successfully. No bids were placed.");
//
//        return new AuctionCloseResponseDTO(winnerName, winningBidAmount, message);
//    }

//    @Override
//    public ApiResponse closeAuction(Long id) {
//        Auction auction = auctionDao.findById(id)
//                .orElseThrow(() -> new ApiException("Auction not found"));
//
//        if (Boolean.TRUE.equals(auction.getIsClosed())) {
//            throw new ApiException("Auction already closed");
//        }
//
//        Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
//
//        if (highestBidOpt.isPresent()) {
//            Bid highestBid = highestBidOpt.get();
//
//            // Set winner
//            User winner = highestBid.getBidder();
//            auction.setWinner(winner);
//
//            // Mark product as sold
//            Product product = auction.getProduct();
//            if (product != null) {
//                product.setSold(true);
//                productDao.save(product);
//            }
//        }
//
//        // Close the auction
//        auction.setIsClosed(true);
//        auction.setUpdatedAt(LocalDateTime.now());
//        auctionDao.save(auction);
//
//        String message = highestBidOpt
//                .map(b -> String.format("Auction closed successfully.\nWinner: %s\nWinning Bid: ₹%.2f",
//                        b.getBidder() != null ? b.getBidder().getFullName() : "Unknown",
//                        b.getBidAmount() != null ? b.getBidAmount() : 0.0))
//                .orElse("Auction closed successfully. No bids were placed.");
//
//        return new ApiResponse(message);
//    }
//    @Override
//    @Transactional
//    public AuctionRespDTO closeAuction(Long id) {
//        // 1. Fetch auction
//        Auction auction = auctionDao.findById(id)
//                .orElseThrow(() -> new ApiException("Auction not found"));
//
//        if (Boolean.TRUE.equals(auction.getIsClosed())) {
//            throw new ApiException("Auction already closed");
//        }
//
//        // 2. Find highest bid
//        Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
//
//        if (highestBidOpt.isPresent()) {
//            Bid highestBid = highestBidOpt.get();
//            User winner = highestBid.getBidder();
//
//            // Set winner
//            auction.setWinner(winner);
//
//            // Mark product as sold
//            Product product = auction.getProduct();
//            if (product != null) {
//                product.setSold(true);
//                productDao.save(product);
//            }
//        }
//
//        // 3. Close auction
//        auction.setIsClosed(true);
//        auction.setUpdatedAt(LocalDateTime.now());
//        auctionDao.save(auction);
//
//        // 4. Build AuctionRespDTO (same style as getAuctionDetails)
//        AuctionRespDTO dto = new AuctionRespDTO();
//        dto.setAuctionId(auction.getAuctionId());
//        dto.setStartTime(auction.getStartTime());
//        dto.setEndTime(auction.getEndTime());
//        dto.setBasePrice(auction.getBasePrice());
//        dto.setIsClosed(auction.getIsClosed());
//        dto.setCreatedAt(auction.getCreatedAt());
//        dto.setUpdatedAt(auction.getUpdatedAt());
//
//        // Product details
//        Product product = auction.getProduct();
//        if (product != null) {
//            dto.setProductId(product.getProductId());
//            dto.setProductName(product.getName());
//            dto.setDescription(product.getDescription());
//            if (product.getCountryOfOrigin() != null) {
//                dto.setCountryOfOrigin(product.getCountryOfOrigin().getCountryName());
//            }
//
//            List<String> productImages = Collections.emptyList();
//            if (product.getImageList() != null && !product.getImageList().isEmpty()) {
//                productImages = product.getImageList().stream()
//                        .map(pi -> pi.getImgUrl())
//                        .filter(Objects::nonNull)
//                        .collect(Collectors.toList());
//            }
//            dto.setProductImages(productImages);
//        } else {
//            dto.setProductImages(Collections.emptyList());
//        }
//
//        // Auctioneer details
//        User auctioneer = auction.getAuctioneer();
//        if (auctioneer != null) {
//            dto.setAuctioneerId(auctioneer.getUserId());
//            dto.setAuctioneerName(auctioneer.getFullName());
//        }
//
//        // Winner & bids
//        if (auction.getWinner() != null) {
//            User winner = auction.getWinner();
//            dto.setWinnerId(winner.getUserId());
//            dto.setWinnerName(winner.getFullName());
//
//            Optional<Bid> winningBidOpt = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
//            Double winningBidAmount = winningBidOpt.map(Bid::getBidAmount).orElse(null);
//            dto.setWinningBidAmount(winningBidAmount);
//
//            Optional<Bid> highestBidAgain = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
//            Double highestBidAmount = highestBidAgain.map(Bid::getBidAmount)
//                    .orElse(auction.getBasePrice());
//            dto.setCurrentHighestBid(highestBidAmount);
//        } else {
//            Optional<Bid> highestBidAgain = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
//            dto.setCurrentHighestBid(highestBidAgain.map(Bid::getBidAmount).orElse(auction.getBasePrice()));
//            dto.setWinningBidAmount(null);
//        }
//
//        return dto;
//    }
    
    @Override
    @Transactional
    public AuctionCloseResponseDTO closeAuction(Long id) {
        Auction auction = auctionDao.findById(id)
                .orElseThrow(() -> new ApiException("Auction not found"));

        if (Boolean.TRUE.equals(auction.getIsClosed())) {
            throw new ApiException("Auction already closed");
        }

        Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);

        Order order = null;

        if (highestBidOpt.isPresent()) {
            Bid highestBid = highestBidOpt.get();

            // Set winner in auction
            User winner = highestBid.getBidder();
            auction.setWinner(winner);

            // Mark product as sold
            Product product = auction.getProduct();
            if (product != null) {
                product.setSold(true);
                productDao.save(product);
            }

            // Create Order entity
            order = Order.builder()
                    .product(product)
                    .bidder(winner)
                    .auctioneer(auction.getAuctioneer())
                    .orderDate(LocalDateTime.now())
                    .finalPrice(BigDecimal.valueOf(highestBid.getBidAmount()))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            orderDao.save(order);
        }

        // Close the auction
        auction.setIsClosed(true);
        auction.setUpdatedAt(LocalDateTime.now());
        auctionDao.save(auction);

        // Prepare response DTO
        AuctionCloseResponseDTO response = new AuctionCloseResponseDTO();
        if (highestBidOpt.isPresent()) {
            Bid highestBid = highestBidOpt.get();
            response.setWinnerName(
                    highestBid.getBidder() != null ? highestBid.getBidder().getFullName() : "Unknown"
            );
            response.setWinningBidAmount(
                    highestBid.getBidAmount() != null ? highestBid.getBidAmount() : 0.0
            );
            response.setMessage(String.format(
                    "Auction closed successfully.\nWinner: %s\nWinning Bid: ₹%.2f\nOrder ID: %d",
                    response.getWinnerName(),
                    response.getWinningBidAmount(),
                    order != null ? order.getOrderId() : 0
            ));
        } else {
            response.setWinnerName(null);
            response.setWinningBidAmount(null);
            response.setMessage("Auction closed successfully. No bids were placed.");
        }
//        Product product = auction.getProduct();
//        ProductDTO dto = new ProductDTO();
//        dto.setProductId(product.getProductId());
//        dto.setName(product.getName());
//        dto.setDescription(product.getDescription());
//        dto.setPrice(product.getPrice());
//        dto.setSold(product.getSold());
//        dto.setCategoryId(product.getCategory().getCategoryId().toString());
//        dto.setCountryOfOriginId(product.getCountryOfOrigin().getCountryId());
//        dto.setYearMade(product.getYearMade());
//        dto.setAuctionedForToday(product.getAuctionedForToday());
//        dto.setImageUrl(product.getImageList()
//                .stream()
//                .map(ProductImage::getImageUrl)
//                .collect(Collectors.toList()));
        // broadcast STOP event (include final highest bid info if any)
        Double finalHighest = highestBidOpt.map(Bid::getBidAmount).orElse(auction.getBasePrice());
        AuctionEvent statusEvent = new AuctionEvent(
                "STOP",
                auction.getAuctionId(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getBasePrice(),
                finalHighest,
                //dto,
                auction.getAuctioneer()
        );
        messagingTemplate.convertAndSend("/topic/auction/" + auction.getAuctionId(), statusEvent);
        messagingTemplate.convertAndSend("/topic/auction", statusEvent);
        System.out.println("📢 Sending STOP event to /topic/auction/" + auction.getAuctionId());
        System.out.println("STOP event payload: " + statusEvent);
        return response;
    }




    @Override
    @Transactional(readOnly = true)
    public List<AuctionRespDTO> getActiveAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<Auction> active = auctionDao.findByIsClosedFalseAndEndTimeAfter(now);
        if (active == null || active.isEmpty()) return Collections.emptyList();

        // 1) Collect productIds for all auctions on this page/list
        List<Long> productIds = active.stream()
                .map(Auction::getProduct)
                .filter(Objects::nonNull)
                .map(Product::getProductId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        // 2) Fetch all images for those productIds in ONE DB call
        Map<Long, List<String>> imagesByProduct = new HashMap<>();
        if (!productIds.isEmpty()) {
            List<Object[]> rows = productImageDao.findProductIdAndImageUrlByProductIds(productIds);
            for (Object[] row : rows) {
                Long pid = ((Number) row[0]).longValue();
                String url = (String) row[1];
                imagesByProduct.computeIfAbsent(pid, k -> new ArrayList<>()).add(url);
            }
        }

        // 3) Map auctions -> DTOs using the prebuilt images map
        return active.stream()
                .map(auction -> {
                    if (auction == null) return null;

                    Product product = auction.getProduct();
                    User auctioneer = auction.getAuctioneer();
                    User winner = auction.getWinner();

                    Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);

                    Optional<Bid> winningBidOpt = Optional.empty();
                    if (winner != null) {
                        winningBidOpt = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
                    }

                    Double highestBidAmount = highestBidOpt.map(Bid::getBidAmount).orElse(auction.getBasePrice());
                    Double winningBidAmount = winningBidOpt.map(Bid::getBidAmount).orElse(null);

                    // get images from map (safe, no extra DB calls)
                    List<String> productImages = Collections.emptyList();
                    if (product != null) {
                        productImages = imagesByProduct.getOrDefault(product.getProductId(), Collections.emptyList());
                    }

                    return AuctionRespDTO.builder()
                            .auctionId(auction.getAuctionId())
                            .startTime(auction.getStartTime())
                            .endTime(auction.getEndTime())
                            .isClosed(auction.getIsClosed())
                            .createdAt(auction.getCreatedAt())
                            .updatedAt(auction.getUpdatedAt())

                            // product
                            .productId(product != null ? product.getProductId() : null)
                            .productName(product != null ? product.getName() : null)
                            .description(product != null ? product.getDescription() : null)
                            .countryOfOrigin(product != null && product.getCountryOfOrigin() != null
                                    ? product.getCountryOfOrigin().getCountryName()
                                    : null)
                            .productImages(productImages) // <-- NEW

                            // auctioneer
                            .auctioneerId(auctioneer != null ? auctioneer.getUserId() : null)
                            .auctioneerName(auctioneer != null ? auctioneer.getFullName() : null)

                            // winner
                            .winnerId(winner != null ? winner.getUserId() : null)
                            .winnerName(winner != null ? winner.getFullName() : null)
                            .winningBidAmount(winningBidAmount)

                            // monetary
                            .basePrice(auction.getBasePrice())
                            .currentHighestBid(highestBidAmount)

                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse deleteAuctionById(Long auctionId) {
        Auction auction = auctionDao.findById(auctionId)
                .orElseThrow(() -> new ApiException("Auction with ID " + auctionId + " not found"));

        if (auction.getIsClosed() != null && !auction.getIsClosed()) {
            throw new ApiException("Cannot delete an active auction. Please close it first.");
        }

        auctionDao.deleteById(auctionId);
        return new ApiResponse("Auction with ID " + auctionId + " has been deleted successfully");
    }

	@Override
	public ApiResponse startAuction(Long id) {
		Auction auction = auctionDao.findById(id)
	            .orElseThrow(() -> new ApiException("Auction not found"));

	    LocalDateTime now = LocalDateTime.now();
	    if (auction.getStartTime() == null || auction.getStartTime().isAfter(now)) {
	        auction.setStartTime(now);
	        auction.setUpdatedAt(now);
	        auctionDao.save(auction);
	    }

	    Double currentHighest = bidDao.findTopByAuctionOrderByBidAmountDesc(auction)
	            .map(Bid::getBidAmount)
	            .orElse(auction.getBasePrice());

	    AuctionEvent startEvent = new AuctionEvent(
	            "START",
	            auction.getAuctionId(),
	            auction.getStartTime(),
	            auction.getEndTime(),
	            auction.getBasePrice(),
	            currentHighest,
	            //auction.getProduct(),
	            auction.getAuctioneer()
	    );
	    messagingTemplate.convertAndSend("/topic/auction/", startEvent);

	    return new ApiResponse("Auction started and event sent");
	}
}
