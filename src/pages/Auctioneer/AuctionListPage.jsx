import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  // Fetch auctions initially
  const fetchAuctions = () => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }
    setLoading(true);
    axios
      .get("http://localhost:8080/auctioneer/auctions", authConfig)
      .then((res) => {
        if (res.status === 204) {
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
  };

  useEffect(() => {
    fetchAuctions();

    // Connect WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws-auction"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      // Listen for bid events
      client.subscribe("/topic/auction/bids", (message) => {
        const bidEvent = JSON.parse(message.body);
        console.log("📨 Bid Event:", bidEvent);

        toast.info(`💰 New bid: ₹${bidEvent.bidAmount} by ${bidEvent.username} for auction ${bidEvent.auctionId}`);
        fetchAuctions(); // Refresh auction list
      });

      // Listen for START / STOP events
      client.subscribe("/topic/auction", (message) => {
        const event = JSON.parse(message.body);
        console.log("📨 Auction Event:", event);

        if (event.type === "STOP") {
          toast.info("🔒 Auction has ended!", { icon: "🔒" });
        } else if (event.type === "START") {
          toast.success("🚀 Auction started!");
        }

        fetchAuctions(); // Refresh auction list
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

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
      <div className="max-w-7xl mx-auto bg-[#fdf6ec] px-6 py-10">
        <ToastContainer />
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Auctions Summary
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
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
                  <img
                    src={getImageSrc(auction)}
                    alt={auction.productName}
                    className="w-full h-48 object-cover"
                  />
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
