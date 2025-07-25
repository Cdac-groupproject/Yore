import React, { useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const productImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
  "/src/assets/Homepage/list4.png",
];

const mockAuction = {
  productName: "Vintage Car",
  productDescription: "Classic 1985 Toyota Land Cruiser.",
  initialBid: 20000,
  highestBid: 25000,
};

const BiddersAuction = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [yourBid, setYourBid] = useState("");
  const [highestBid, setHighestBid] = useState(mockAuction.highestBid);

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

  const handleBid = () => {
    const bidValue = Number(yourBid);
    if (bidValue > highestBid) {
      setHighestBid(bidValue);
      setYourBid("");
      // alert("Bid placed successfully!");
      toast.success("Bid Placed Successfully!");
    } else {
      // alert("Your bid must be higher than the current highest bid.");
      toast.error("Your bid must be higher than the current highest bid");
    }
  };

  const handleIncrease = () => {
    setYourBid((prev) => String(Number(prev) + 500));
  };

  return (
    <>
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
                  }}
                >
                  {">"}
                </button>
              </div>
              {/* <div style={{ marginTop: 8, fontSize: 16 }}>Product Images</div> */}
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
                      value={`$${highestBid}`}
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
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: 4,
                      border: "1px solid #888",
                      background: "#eee",
                    }}
                  >
                    Place Bid
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
