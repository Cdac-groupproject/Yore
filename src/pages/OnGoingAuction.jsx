import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuctionCard from "../components/AuctionCard";
import car from "../assets/Homepage/car.png";
import paint from "../assets/Homepage/list2.jpg";
import { useNavigate } from "react-router-dom";

function UpcomingAuction() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loggeInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggeInInfo) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    const fetchActive = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/auctioneer/auctions/active", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // If you use token-based auth, send it here:
             "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          signal: controller.signal,
        });

        if (res.status === 204) {
          setAuctions([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json(); // expected: array of AuctionRespDTO
        setAuctions(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch active auctions:", err);
          setError("Failed to load auctions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActive();
    return () => controller.abort();
  }, [navigate]);

  const fmtDate = (isoStr) => {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
    } catch {
      return isoStr;
    }
  };

  const getImageSrc = (a) => {
    const imgs = a?.productImages || [];
    if (imgs.length > 0) {
  const first = imgs[0];
  const path = first.startsWith('/') ? first : `/${first}`;
  return first.startsWith("http") ? first : `http://localhost:8080${path}`;
}
    // fallback by heuristics
    const name = (a?.productName || "").toLowerCase();
    if (name.includes("car")) return car;
    return paint;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Active / Upcoming Auctions</h2>

        {loading && <div className="text-gray-600 mb-4">Loading auctions...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex flex-wrap justify-center gap-6">
          {/* If no auctions, show two sample cards (keeps same UI as before) */}
          {!loading && auctions.length === 0 ? (
            <>
              <AuctionCard
                image={car}
                title="Vintage Car Aution"
                autioneer="Vikrant kale"
                sdate="25-07-2025"
                edate="27-07-2025"
                onView={() => navigate("/auctions/sample/1")}
              />
              <AuctionCard
                image={paint}
                title="Paint Aution"
                autioneer="Pranit"
                sdate="25-08-2025"
                edate="27-08-2025"
                onView={() => navigate("/auctions/sample/2")}
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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UpcomingAuction;
