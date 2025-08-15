import { myAxios } from "./config";

export const getOrders = async (bidderId) => {
  try {
    const response = await myAxios.get(`/${bidderId}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bidder orders:", error);
    throw error;
  }
};
