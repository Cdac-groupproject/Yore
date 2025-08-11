import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const USER_ID = 4;

function AuctionDetails() {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/auctioneer/auctions/${auctionId}`);
        setAuction(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load auction details.");
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  const handleBid = async () => {
    try {
      const res = await axios.post("http://localhost:8080/bidder/bids/place", {
        auctionId: parseInt(auctionId),
        bidderId: USER_ID,
        bidAmount: parseFloat(bidAmount),
      });

      setMessage("Bid placed successfully!");
      setBidAmount(""); // reset input
    } catch (err) {
      console.error(err);
      setError("Bid failed. Make sure bid amount is valid.");
    }
  };

  const getImageSrc = (a) => {
    const imgs = a?.productImages || [];
    if (imgs.length > 0) {
      const first = imgs[0];
      const path = first.startsWith("/") ? first : `/${first}`;
      return first.startsWith("http") ? first : `http://localhost:8080${path}`;
    }
    return "https://via.placeholder.com/300"; // fallback
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Auction Details</h1>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {auction ? (
        <div className="bg-white p-6 rounded shadow">
          <img
            src={getImageSrc(auction)}
            alt={auction.productName}
            className="w-96 h-64 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">{auction.productName}</h2>
          <p>Start Date: {new Date(auction.startTime).toLocaleString()}</p>
          <p>End Date: {new Date(auction.endTime).toLocaleString()}</p>
          <p>Base Price: ₹{auction.basePrice}</p>
          <p>Current Highest Bid: ₹{auction.currentHighestBid || "None"}</p>

          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter bid amount"
              className="border px-2 py-1 mr-2"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={handleBid}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Place Bid
            </button>
          </div>
        </div>
      ) : (
        <p>Loading auction...</p>
      )}
    </div>
  );
}

export default AuctionDetails;
