package com.project.dto;

public class AuctionCloseResponseDTO {
    private String winnerName;
    private Double winningBidAmount;
    private String message;

    public AuctionCloseResponseDTO() {}

    public AuctionCloseResponseDTO(String winnerName, Double winningBidAmount, String message) {
        this.winnerName = winnerName;
        this.winningBidAmount = winningBidAmount;
        this.message = message;
    }

    public String getWinnerName() { return winnerName; }
    public void setWinnerName(String winnerName) { this.winnerName = winnerName; }

    public Double getWinningBidAmount() { return winningBidAmount; }
    public void setWinningBidAmount(Double winningBidAmount) { this.winningBidAmount = winningBidAmount; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}