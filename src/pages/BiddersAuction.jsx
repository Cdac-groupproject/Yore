import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { placeBid, getAuctionDetailsById, getHighestBid } from "../api/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

const STEP = 500;

const BiddersAuction = () => {
  const { auctionId } = useParams();
  const userId = parseInt(sessionStorage.getItem("userId"), 10);

  const [auction, setAuction] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [yourBid, setYourBid] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState("");
  const [placing, setPlacing] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  // ✅ Load auction & initial highest bid on mount
  useEffect(() => {
    if (!auctionId) return;
    fetchAuctionDetails();
    fetchInitialHighestBid();
  }, [auctionId]);

  // ✅ Setup WebSocket listeners
  useEffect(() => {
    if (!auctionId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-auction"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      // Listen for new bids
      client.subscribe(`/topic/auction/${auctionId}/bids`, (message) => {
        const bidEvent = JSON.parse(message.body);
        setHighestBid(bidEvent.bidAmount);
        setHighestBidder(bidEvent.username);

        // Show toast only if bid is from another user
        if (bidEvent.userId !== userId) {
          toast.success(`💰 New bid: ₹${bidEvent.bidAmount} by ${bidEvent.username}`);
        }
      });
      client.subscribe(`/topic/auction`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const startEvent = JSON.parse(message.body);
        if (startEvent.type === "START") {
        toast.success(`🚀 A new Auction has started! By ${startEvent.auctioneer.fullName} `);
        }
      });


      // Listen for auction status updates
      client.subscribe(`/topic/auction/${auctionId}`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const auctionEvent = JSON.parse(message.body);
        if (auctionEvent.type === "STOP") {
        toast(" 🔒 Auction has ended!");
        setAuctionEnded(true);
        setHighestBid(auctionEvent.currentHighestBid);

        //  Disconnect WebSocket
        client.deactivate();
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
    };

    client.activate();
    return () => client.deactivate();
  }, [auctionId, userId]);

  // Fetch auction details
  const fetchAuctionDetails = async () => {
    try {
      const data = await getAuctionDetailsById(auctionId);
      setAuction(data);
    } catch (err) {
      console.error("Failed to fetch auction details:", err);
      toast.error("Could not load auction details");
    }
  };

  // Fetch initial highest bid before WebSocket kicks in
  const fetchInitialHighestBid = async () => {
    try {
      const bidData = await getHighestBid(auctionId);
      if (bidData) {
        setHighestBid(bidData.bidAmount || 0);
        setHighestBidder(bidData.username || "");
      }
    } catch (err) {
      console.error("Failed to fetch highest bid:", err);
      toast.error("Could not load highest bid");
    }
  };

  const handleBid = async () => {
    const bidValue = Number(yourBid);
    if (isNaN(bidValue) || bidValue <= highestBid) {
      toast.error("Your bid must be higher than the current highest bid");
      return;
    }

    setPlacing(true);
    try {
      await placeBid(auctionId, bidValue);
      toast.success("✅ Bid placed successfully!");
      setYourBid("");
    } catch (err) {
      console.error("placeBid error:", err);
      toast.error("Failed to place bid");
    } finally {
      setPlacing(false);
    }
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? getImages().length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % getImages().length);
  };

  const handleIncrease = () => {
    const current = Number(yourBid) || highestBid || 0;
    setYourBid(String(current + STEP));
  };

  const getImages = () => {
    return auction?.productImages?.length ? auction.productImages : fallbackImages;
  };

  if (!auction) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20 }}>Loading auction details...</div>
      </>
    );
  }

  const safeImages = getImages();

  return (
    <>
      <Toaster />
      <Navbar />
      <div style={{ display: "flex", backgroundColor: "#f5f0e1", padding: "1.5rem" }}>
        {/* Image Carousel */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 8, background: "#fafafa" }}>
            <button onClick={handlePrev} style={navButtonStyle}>{"<"}</button>
            <img
              src={
                safeImages[currentImage]?.startsWith("http")
                  ? safeImages[currentImage]
                  : safeImages[currentImage]?.startsWith("/src/assets/")
                    ? safeImages[currentImage]
                    : `http://localhost:8080/${safeImages[currentImage]}`
              }
              alt="Product"
              style={{ width: 550, height: 400, objectFit: "contain" }}
            />
            <button onClick={handleNext} style={navButtonStyle}>{">"}</button>
          </div>
        </div>

        {/* Auction Details */}
        <div style={auctionCardStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input type="text" value={auction.productName} readOnly style={inputStyle} />
            <textarea value={auction.description} readOnly style={textareaStyle} />

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label>Base Price</label>
                <input value={`₹ ${auction.basePrice}`} readOnly style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Highest Bid</label>
                <input value={`₹ ${highestBid || auction.basePrice}`} readOnly style={inputStyle} />
              </div>
            </div>

            <div>
              <label>Your Bid</label>
              <input
                type="number"
                value={yourBid}
                onChange={(e) => setYourBid(e.target.value)}
                style={inputStyle}
                min={highestBid + 1}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={handleBid} disabled={placing || auctionEnded} style={buttonStyle}>
                {placing ? "Placing..." : "Place Bid"}
              </button>
              <button onClick={handleIncrease} disabled={auctionEnded} style={buttonStyle}>Increase</button>
            </div>
            {auctionEnded && (
            <div style={{ color: "red", marginTop: "10px" }}>
              Auction has ended. No more bids allowed.
            </div>
          )}

            <div style={{ marginTop: 12, color: "#666" }}>
              <small>Highest Bidder: {highestBidder || "No bids yet"}</small><br />
              <small>Viewing Auction ID: {auctionId}</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Styles
const navButtonStyle = {
  fontSize: '24px',
  padding: '10px 20px',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: '#eee',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};
const auctionCardStyle = {
  width: 450,
  background: "white",
  padding: 20,
  borderRadius: 8,
};
const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: 4,
  border: "1px solid #ccc",
};
const textareaStyle = {
  ...inputStyle,
  resize: "none",
  height: 60,
};
const buttonStyle = {
  flex: 1,
  padding: "0.5rem",
  borderRadius: 4,
  border: "1px solid #888",
  background: "#eee",
  cursor: "pointer",
};

export default BiddersAuction;
