import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:8080/auctioneer/auctions", authConfig)
      .then((res) => {
        if (res.status === 204) {
          toast.info("No auctions available.");
          setAuctions([]);
        } else if (Array.isArray(res.data)) {
          setAuctions(res.data);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error fetching auctions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const getImageSrc = (auction) => {
    const images =
      auction?.productImages?.length > 0 ? auction.productImages : fallbackImages;

    const firstImage = images[0];

    return firstImage?.startsWith("http")
      ? firstImage
      : firstImage?.startsWith("/src/assets/")
      ? firstImage
      : `http://localhost:8080/${firstImage}`;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Auctions Summary
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border rounded-xl p-4 shadow-sm bg-white"
              >
                <div className="w-full h-48 bg-gray-200 rounded-md"></div>
                <div className="h-4 bg-gray-200 mt-4 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 mt-2 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <p className="text-center text-gray-500">No auctions available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctions.map((auction) => {
              const isOngoing = !auction.isClosed;
              return (
                <div
                  key={auction.auctionId}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Product Image */}
                  <img
                    src={getImageSrc(auction)}
                    alt={auction.productName}
                    className="w-full h-48 object-cover"
                  />

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {auction.productName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isOngoing
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isOngoing ? "Ongoing" : "Closed"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {auction.description}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>
                        Base Price:{" "}
                        <span className="font-medium text-gray-800">
                          ₹{auction.basePrice}
                        </span>
                      </p>
                      <p>
                        Highest Bid:{" "}
                        <span className="font-medium text-green-600">
                          ₹{auction.currentHighestBid}
                        </span>
                      </p>
                      <p>Auctioneer: {auction.auctioneerName || "N/A"}</p>
                      <p>
                        Ends:{" "}
                        {auction.endTime
                          ? new Date(auction.endTime).toLocaleString()
                          : "N/A"}
                      </p>

                      {!isOngoing && auction.winnerName && (
                        <p className="mt-2 text-sm text-blue-600 font-medium">
                          Winner: {auction.winnerName} (₹
                          {auction.winningBidAmount})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
