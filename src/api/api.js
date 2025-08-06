// src/api/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  // You might want to send credentials/cookies:
  // withCredentials: true,
});

export async function getHighestBid(auctionId) {
  // Returns the parsed response data or throws.
  const resp = await client.get(`/bidder/bids/highest/${auctionId}`);
  return resp.data;
}

/**
 * placeBid payload should be { auctionId, userId, bidAmount }
 * Returns saved BidRespDTO (data).
 */
export async function placeBid(payload) {
  const resp = await client.post("/bidder/bids/place", payload);
  return resp.data;
}

// export client if you need it elsewhere
export { client as axiosClient };
