import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { getHighestBid, placeBid } from "../api/api";
import jwtDecode from "jwt-decode"; // <-- added

const productImages = [
  "/assets/Homepage/car.png",
  "/assets/Homepage/list1.png",
  "/assets/Homepage/list2.jpg",
  "/assets/Homepage/list3.png",
  "/assets/Homepage/list4.png",
];

const mockAuction = {
  auctionId: 1,
  productName: "Vintage Car",
  productDescription: "Classic 1985 Toyota Land Cruiser.",
  initialBid: 20000,
  highestBid: 25000,
};

const STEP = 500;

const BiddersAuction = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [yourBid, setYourBid] = useState("");
  const [highestBid, setHighestBid] = useState(mockAuction.highestBid);
  const [userId, setUserId] = useState(null); // <-- new state
  const [placing, setPlacing] = useState(false);
  const [loadingHighest, setLoadingHighest] = useState(false);

  useEffect(() => {
    // Decode token on mount
    const token = localStorage.getItem("token"); // adjust if using sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming backend stores userId in token payload as `userId`
        setUserId(decoded.userId || decoded.sub || null);
      } catch (err) {
        console.error("Invalid token", err);
        toast.error("Invalid session token. Please login again.");
      }
    } else {
      toast.error("You must login first.");
    }

    fetchHighestBid();
  }, []);

  const fetchHighestBid = async () => {
    setLoadingHighest(true);
    try {
      const data = await getHighestBid(mockAuction.auctionId);
      setHighestBid(Number(data.bidAmount || mockAuction.initialBid));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch highest bid.");
    } finally {
      setLoadingHighest(false);
    }
  };

  const isBidValid = () => {
    const bidValue = Number(yourBid);
    return !isNaN(bidValue) && bidValue > highestBid;
  };

  const handleBid = async () => {
    if (!userId) {
      toast.error("Please login to place a bid.");
      return;
    }
    const bidValue = Number(yourBid);
    if (isNaN(bidValue) || bidValue <= highestBid) {
      toast.error("Your bid must be higher than the current highest bid.");
      return;
    }

    const previousHighest = highestBid;
    setHighestBid(bidValue);
    setPlacing(true);

    try {
      await placeBid({
        auctionId: mockAuction.auctionId,
        userId,
        bidAmount: bidValue,
      });
      toast.success("Bid placed successfully!");
      setYourBid("");
    } catch (err) {
      setHighestBid(previousHighest);
      toast.error("Failed to place bid.");
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  const handleIncrease = () => {
    const current = Number(yourBid);
    setYourBid(isNaN(current) ? String(highestBid + STEP) : String(current + STEP));
  };

  return (
    <>
      <Toaster />
      <Navbar />
      {/* ... your existing JSX code ... */}
    </>
  );
};

export default BiddersAuction;
