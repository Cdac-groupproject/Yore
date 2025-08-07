import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { getHighestBid, placeBid } from "../api/api";

const productImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
  "/src/assets/Homepage/list4.png",
];

const mockAuction = {
  auctionId: 6, // fixed testing auction id
  productName: "Vintage Car",
  productDescription: "Classic 1985 Toyota Land Cruiser.",
  initialBid: 20000,
  highestBid: 25000,
};

const BiddersAuction = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [yourBid, setYourBid] = useState("");
  const [highestBid, setHighestBid] = useState(mockAuction.highestBid);
  const [loadingHighest, setLoadingHighest] = useState(false);
  const [placing, setPlacing] = useState(false);

  // fixed test user
  const userId = 4;
  const auctionId = mockAuction.auctionId;
  const STEP = 500;

  useEffect(() => {
    fetchHighestBid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHighestBid = async () => {
    setLoadingHighest(true);
    try {
      const data = await getHighestBid(auctionId);
      // normalize response shapes (adjust if your API returns different keys)
      const amount = data?.bidAmount ?? data?.bid_amount ?? data?.amount ?? mockAuction.initialBid;
      setHighestBid(Number(amount));
    } catch (err) {
      console.error("fetchHighestBid error:", err);
      toast.error("Failed to fetch highest bid. Check backend/CORS.");
      // fallback to initial bid to keep UI usable
      setHighestBid(mockAuction.initialBid);
    } finally {
      setLoadingHighest(false);
    }
  };

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleBid = async () => {
    const bidValue = Number(yourBid);
    if (isNaN(bidValue) || bidValue <= highestBid) {
      toast.error("Your bid must be higher than the current highest bid");
      return;
    }

    const previousHighest = highestBid;
    setHighestBid(bidValue); // optimistic UI
    setPlacing(true);

    try {
      const payload = {
        auctionId,
        userId,
        bidAmount: bidValue,
      };
      const resp = await placeBid(payload);
      // resp handling depends on backend; we refresh the highest to be sure
      await fetchHighestBid();
      setYourBid("");
      toast.success("Bid Placed Successfully!");
      return resp;
    } catch (err) {
      console.error("placeBid error:", err);
      setHighestBid(previousHighest); // rollback
      const message = err?.response?.data || err?.message || "Failed to place bid.";
      toast.error(String(message));
    } finally {
      setPlacing(false);
    }
  };

  const handleIncrease = () => {
    const current = Number(yourBid) || 0;
    // ensure increase from either input or current highest
    const base = current <= 0 ? highestBid : current;
    setYourBid(String(Number(base) + STEP));
  };

  return (
    <>
      <Toaster />
      <Navbar />
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#f5f0e1",
          fontFamily: "sans-serif",
        }}
      >
        {/* Main Content */}
        <div style={{ flex: 1, padding: "1.5rem" }}>
          {/* Header */}
          <div style={{ display: "flex", gap: "2rem" }}>
            {/* Carousel */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                <button
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 24,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {"<"}
                </button>
                <img
                  src={productImages[currentImage]}
                  alt="Product"
                  style={{
                    width: 550,
                    height: 400,
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                />
                <button
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 24,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {">"}
                </button>
              </div>
            </div>

            {/* Auction Details */}
            <div
              style={{
                width: 450,
                background: "white",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 450,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <input
                  type="text"
                  value={mockAuction.productName}
                  readOnly
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    padding: "0.5rem",
                    borderRadius: 4,
                    border: "0px solid #ccc",
                  }}
                />
                <textarea
                  value={mockAuction.productDescription}
                  readOnly
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    padding: "0.5rem",
                    borderRadius: 4,
                    border: "0px solid #ccc",
                    resize: "none",
                    height: 60,
                  }}
                />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14 }}>Initial Bid Price</label>
                    <input
                      type="text"
                      value={`$${mockAuction.initialBid}`}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        marginTop: 4,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14 }}>Highest Bid Price</label>
                    <input
                      type="text"
                      value={loadingHighest ? "Loading..." : `$${highestBid}`}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        marginTop: 4,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 14 }}>Your Bid Price</label>
                  <input
                    type="number"
                    value={yourBid}
                    onChange={(e) => setYourBid(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      marginTop: 4,
                    }}
                    min={highestBid + 1}
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    onClick={handleBid}
                    disabled={placing}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #888",
                      background: "#eee",
                      cursor: placing ? "not-allowed" : "pointer",
                    }}
                  >
                    {placing ? "Placing..." : `Place Bid (user ${userId})`}
                  </button>
                  <button
                    onClick={handleIncrease}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #888",
                      background: "#eee",
                    }}
                  >
                    Increase
                  </button>
                  <button
                    onClick={fetchHighestBid}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #888",
                      background: "#eee",
                    }}
                  >
                    Refresh
                  </button>
                </div>

                <div style={{ marginTop: 12, color: "#666" }}>
                  <small>
                    Testing with auctionId = {auctionId}, userId = {userId}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default BiddersAuction;
