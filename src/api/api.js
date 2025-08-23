import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Create axios instance with default headers
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token before every request if token exists
client.interceptors.request.use(config => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic error handler function
function handleApiError(error, defaultMessage) {
  const message =
    error.response?.data?.message || error.message || defaultMessage;
  console.error(message, error);
  throw new Error(message);
}

// Fetch auction details by ID
export async function getAuctionDetailsById(auctionId) {
  try {
    const res = await client.get(`/auctioneer/auctions/${auctionId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch auction details");
  }
}

// Fetch highest bid for given auction ID
export async function getHighestBid(auctionId) {
  try {
    const res = await client.get(`/bidder/bids/highest/${auctionId}`);
    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch highest bid");
  }
}

// Place a bid; backend gets userId from token, so no userId sent here
export async function placeBid(auctionId, bidAmount) {
  try {
    const res = await client.post("/bidder/bids/place", {
      auctionId,
      bidAmount,
    });
    return res.data;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
}

export { client as axiosClient };
