import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import { getAuctionDetailsById } from "../../api/api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

const navButtonStyle = {
  fontSize: "24px",
  padding: "10px 20px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#eee",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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

const AuctioneerOngoingPage = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [terminateLoading, setTerminateLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  // Winner info state
  const [winnerName, setWinnerName] = useState("");
  const [winningBidAmount, setWinningBidAmount] = useState("");
  const [showWinner, setShowWinner] = useState(false);

  const [auctionEnded, setAuctionEnded] = useState(false);
  const intervalRef = useRef();

  // Current logged-in user ID
  const userId = sessionStorage.getItem("userId");

  // Fetch auction details once
  useEffect(() => {
    if (!auctionId) return;

    const fetchAuction = async () => {
      try {
        const data = await getAuctionDetailsById(auctionId);
        setAuction(data);
        setIsClosed(data.isClosed); // Track closed state
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    fetchAuction();
  }, [auctionId]);

  // WebSocket connection instead of polling
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

      // Listen for auction start events
      client.subscribe(`/topic/auction`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const startEvent = JSON.parse(message.body);
        if (startEvent.type === "START") {
          toast.success(`🚀 A new Auction has started! By ${startEvent.auctioneer.fullName}`);
        }
      });

      // Listen for auction stop events
      client.subscribe(`/topic/auction/${auctionId}`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const auctionEvent = JSON.parse(message.body);
        if (auctionEvent.type === "STOP") {
          toast("🔒 Auction has ended!");
          setAuctionEnded(true);
          setHighestBid(auctionEvent.currentHighestBid);

          // Disconnect WebSocket
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

  // Terminate auction handler
  const terminateAuction = async () => {
    if (!auctionId) return;
    setTerminateLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      const result = await axios.put(
        `http://localhost:8080/auctioneer/auctions/close/${auctionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { winnerName, winningBidAmount, message } = result.data;

      if (message?.toLowerCase().includes("already closed")) {
        toast.error("Auction already closed");
      } else {
        setWinnerName(winnerName || "No winner");
        setWinningBidAmount(
          winningBidAmount != null ? winningBidAmount : "--"
        );
        setShowWinner(true);
        toast.success(message || "Auction terminated successfully");
      }
      setIsClosed(true); // Set isClosed immediately
      if (intervalRef.current) clearInterval(intervalRef.current); // Stop polling if it was there
    } catch (err) {
      if (
        err.response?.data?.message?.toLowerCase().includes("already closed")
      ) {
        toast.error("Auction already closed");
      } else {
        toast.error("Failed to terminate auction");
      }
    } finally {
      setTerminateLoading(false);
    }
  };

  const getImages = () => {
    return auction?.productImages?.length ? auction.productImages : fallbackImages;
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? getImages().length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % getImages().length);
  };

  if (loading || !auction) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20 }}>Loading auction details...</div>
      </>
    );
  }

  const images = getImages();
  const safeImages = images && images.length ? images : fallbackImages;

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f0e1" }}>
        <div style={{ flex: 1, padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 650,
                  height: 450,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  background: "#fafafa",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
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
            </div>

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
                    <input
                      value={`₹ ${highestBid}`}
                      readOnly
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={terminateAuction}
                    disabled={terminateLoading}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #888",
                      background: "#f44336",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    {terminateLoading ? "Terminating..." : "Terminate Auction"}
                  </button>
                </div>

                {showWinner && (
                  <div style={{ marginTop: 20, padding: 10, background: "#f9f9f9", borderRadius: 6 }}>
                    <div>
                      <label>Winner Name</label>
                      <input value={winnerName} readOnly style={inputStyle} />
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <label>Winning Bid Amount</label>
                      <input value={`$${winningBidAmount}`} readOnly style={inputStyle} />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 12, color: "#666" }}>
                  <small>Viewing Auction ID: {auctionId}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctioneerOngoingPage;
