package com.project.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.project.custom_exception.ApiException;
import com.project.custom_exception.ResourceNotFoundException;
import com.project.dao.AuctionDao;
import com.project.dao.BidDao;
import com.project.dao.UserDao;
import com.project.dao.product.ProductDao;
import com.project.dto.AddAuctionDTO;
import com.project.dto.ApiResponse;
import com.project.dto.AuctionRespDTO;
import com.project.entity.Auction;
import com.project.entity.Bid;
import com.project.entity.Product;
import com.project.entity.User;

import jakarta.transaction.Transactional;
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
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse addNewAuction(AddAuctionDTO dto) {
        Product product = productDao.findById(dto.getProductId())
                .orElseThrow(() -> new ApiException("Invalid Product ID"));

        User auctioneer = userDao.findById(dto.getAuctioneerId())
                .orElseThrow(() -> new ApiException("Invalid Auctioneer ID"));

        if (Boolean.TRUE.equals(product.getSold())) {
            throw new ApiException("Product is already sold.");
        }

        if (auctionDao.existsByProduct(product)) {
            throw new ApiException("Auction already exists for this product.");
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

        return new ApiResponse("Added new Auction with ID=" + persistentAuction.getAuctionId());
    }

    @Override
    public List<AuctionRespDTO> getAllAuctions() {
        List<Auction> auctions = auctionDao.findAll();
        if (auctions == null || auctions.isEmpty()) return Collections.emptyList();

        return auctions.stream()
                .map(auction -> {
                    // inline mapping (null-safe) and bid lookups
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
        }

        // 4. Auctioneer details (null-safe)
        User auctioneer = auction.getAuctioneer();
        if (auctioneer != null) {
            dto.setAuctioneerId(auctioneer.getUserId());
            dto.setAuctioneerName(auctioneer.getFullName());
        }

        // 5. Bids: winning or current highest
        if (auction.getWinner() != null) {
            User winner = auction.getWinner();
            dto.setWinnerId(winner.getUserId());
            dto.setWinnerName(winner.getFullName());

            // winning bid for the winner (if any)
            Optional<Bid> winningBidOpt = bidDao.findTopByAuctionAndBidderOrderByBidAmountDesc(auction, winner);
            Double winningBidAmount = winningBidOpt.map(Bid::getBidAmount).orElse(null);
            dto.setWinningBidAmount(winningBidAmount);

            // Always also set current highest bid (may be same as winningBidAmount)
            Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
            Double highestBidAmount = highestBidOpt.map(Bid::getBidAmount)
                    .orElse(auction.getBasePrice()); // fallback (could be null)
            dto.setCurrentHighestBid(highestBidAmount);

        } else {
            // No winner -> set only current highest (fallback to base price)
            Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);
            dto.setCurrentHighestBid(highestBidOpt.map(Bid::getBidAmount).orElse(auction.getBasePrice()));
            dto.setWinningBidAmount(null); // explicit
        }

        return dto;
    }

    @Override
    public ApiResponse closeAuction(Long id) {
        Auction auction = auctionDao.findById(id)
                .orElseThrow(() -> new ApiException("Auction not found"));

        if (Boolean.TRUE.equals(auction.getIsClosed())) {
            throw new ApiException("Auction already closed");
        }

        Optional<Bid> highestBidOpt = bidDao.findTopByAuctionOrderByBidAmountDesc(auction);

        if (highestBidOpt.isPresent()) {
            Bid highestBid = highestBidOpt.get();

            // Set winner
            User winner = highestBid.getBidder();
            auction.setWinner(winner);

            // Mark product as sold
            Product product = auction.getProduct();
            if (product != null) {
                product.setSold(true);
                productDao.save(product);
            }
        }

        // Close the auction
        auction.setIsClosed(true);
        auction.setUpdatedAt(LocalDateTime.now());
        auctionDao.save(auction);

        String message = highestBidOpt
                .map(b -> String.format("Auction closed successfully.\nWinner: %s\nWinning Bid: ₹%.2f",
                        b.getBidder() != null ? b.getBidder().getFullName() : "Unknown",
                        b.getBidAmount() != null ? b.getBidAmount() : 0.0))
                .orElse("Auction closed successfully. No bids were placed.");

        return new ApiResponse(message);
    }

    @Override
    public List<AuctionRespDTO> getActiveAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<Auction> active = auctionDao.findByIsClosedFalseAndEndTimeAfter(now);
        if (active == null || active.isEmpty()) return Collections.emptyList();

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
}
