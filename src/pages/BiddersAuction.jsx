import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { placeBid, getAuctionDetailsById, getHighestBid } from "../api/api";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

const BiddersAuction = () => {
  const { auctionId } = useParams();
  const userId = parseInt(localStorage.getItem("userId"), 10);

  const STEP = 500;

  const [auction, setAuction] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [yourBid, setYourBid] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [loadingHighest, setLoadingHighest] = useState(false);
  const [placing, setPlacing] = useState(false);


useEffect(() => {
  if (!auctionId) return;
  fetchAuctionDetails();
  fetchHighestBid();
}, [auctionId]);

//useEffect to poll highest bid
useEffect(() => {
  if (!auctionId) return;

  const interval = setInterval(() => {
    fetchHighestBid();
  }, 1000); // fetch every 5 seconds

  return () => clearInterval(interval);
}, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const data = await getAuctionDetailsById(auctionId);
      setAuction(data);
    } catch (err) {
      console.error("Failed to fetch auction details:", err);
      toast.error("Could not load auction details");
    }
  };

  const fetchHighestBid = async () => {
    setLoadingHighest(true);
    try {
      const res = await getHighestBid(auctionId);
      // Try various possible keys for amount
      const amount = res?.bidAmount ?? res?.bid_amount ?? res?.amount ?? 0;
      setHighestBid(Number(amount));
    } catch (err) {
      console.error("fetchHighestBid error:", err);
      toast.error("Failed to fetch highest bid");
    } finally {
      setLoadingHighest(false);
    }
  };

  const handleBid = async () => {
   

    const bidValue = Number(yourBid);

    if (isNaN(bidValue) || bidValue <= highestBid) {
      toast.error("Your bid must be higher than the current highest bid");
      return;
    }

    const previousHighest = highestBid;
    setHighestBid(bidValue);
    setPlacing(true);

    try {
      await placeBid(auctionId, bidValue);
      toast.success("Bid Placed Successfully!");
      setYourBid("");
      await fetchHighestBid(); // refresh latest from server
    } catch (err) {
      console.error("placeBid error:", err);
      setHighestBid(previousHighest); // rollback
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
const images = getImages();
  const safeImages = images && images.length ? images : fallbackImages;
  return (
    <>
      <Toaster />
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
                          ? safeImages[currentImage] // Use as-is for local assets
                          : `http://localhost:8080/${safeImages[currentImage]}` // Prepend for backend images
                    
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
                      value={loadingHighest ? "Loading..." : `₹ ${highestBid}`}
                      readOnly
                      style={inputStyle}
                    />
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
                  <button onClick={handleBid} disabled={placing} style={buttonStyle}>
                    {placing ? "Placing..." : `Place Bid`}
                  </button>
                  <button onClick={handleIncrease} style={buttonStyle}>Increase</button>
                  <button onClick={fetchHighestBid} style={buttonStyle}>Refresh</button>
                </div>

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
