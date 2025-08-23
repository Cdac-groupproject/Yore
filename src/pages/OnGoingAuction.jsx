import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuctionCard from "../components/AuctionCard";
import car from "../assets/Homepage/car.png";
import paint from "../assets/Homepage/list2.jpg";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function UpcomingAuction() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Fetch active auctions from backend */
  const fetchActive = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/auctioneer/auctions/active", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      if (res.status === 204) {
        setAuctions([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setAuctions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch active auctions:", err);
      setError("Failed to load auctions");
    } finally {
      setLoading(false);
    }
  };

  /** Format date to dd/mm/yyyy */
  const fmtDate = (isoStr) => {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-GB");
    } catch {
      return isoStr;
    }
  };

  /** Get image source for auction */
  const getImageSrc = (a) => {
    const imgs = a?.productImages || [];
    if (imgs.length > 0) {
      const first = imgs[0];
      const path = first.startsWith("/") ? first : `/${first}`;
      return first.startsWith("http") ? first : `http://localhost:8080${path}`;
    }
    const name = (a?.productName || "").toLowerCase();
    if (name.includes("car")) return car;
    return paint;
  };

  /** Connect to WebSocket on mount */
  useEffect(() => {
    const loggeInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggeInInfo) {
      navigate("/login");
      return;
    }

    // 1. Fetch initial active auctions
    fetchActive();

    // 2. Connect WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-auction"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      // Subscribe to *all* auction events
      client.subscribe(`/topic/auction`, (message) => {
        console.log("📩 Received WebSocket message:", message.body);
        const auctionEvent = JSON.parse(message.body);

        if (auctionEvent.type === "START") {
          toast.success(`🚀 Auction has started By ${auctionEvent.auctioneer.fullName}`);
          fetchActive(); // refresh list
        } else if (auctionEvent.type === "STOP") {
          toast("🔒 Auction has ended!", { icon: "🔒" });
          fetchActive(); // refresh list
        }
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [navigate]);

  return (
    <div className="bg-[#fdf6ec] min-h-screen">
      <Navbar />
      <Toaster position="top-right" />

      <div className="flex flex-col items-center px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Active / Upcoming Auctions</h2>

        {loading && <div className="text-gray-600 mb-4">Loading auctions...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
          {!loading && auctions.length === 0 ? (
            <>
              <AuctionCard
                image={car}
                title="Vintage Car Auction"
                autioneer="Vikrant Kale"
                sdate="25-07-2025"
                edate="27-07-2025"
                onView={() => navigate("/auctions/sample/1")}
                cardWidth="w-full"
              />
              <AuctionCard
                image={paint}
                title="Paint Auction"
                autioneer="Pranit"
                sdate="25-08-2025"
                edate="27-08-2025"
                onView={() => navigate("/auctions/sample/2")}
                cardWidth="w-full"
              />
            </>
          ) : (
            auctions.map((a) => (
              <AuctionCard
                key={a.auctionId}
                image={getImageSrc(a)}
                title={a.productName || "Untitled Product"}
                autioneer={a.auctioneerName || "Unknown"}
                sdate={fmtDate(a.startTime)}
                edate={fmtDate(a.endTime)}
                basePrice={a.basePrice}
                auctionId={a.auctionId}
                currentHighestBid={a.currentHighestBid}
                onView={() => navigate(`/bidder/${a.auctionId}`)}
                cardWidth="w-full"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingAuction;