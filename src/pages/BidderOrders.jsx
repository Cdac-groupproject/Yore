import React, { useEffect, useState } from "react";
import { getOrders } from "../services/bidderService";
import Navbar from "../components/Navbar";

const BidderOrders = ({ bidderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        const bidderId = storedUser?.user_id;
        console.log("bidder id = ", bidderId);
        if (!bidderId) throw new Error("Bidder ID not found");
        const data = await getOrders(bidderId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [bidderId]);

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="text-center mt-10">No orders found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Order Date</th>
                <th className="py-2 px-4 border-b">Final Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{order.productName}</td>
                  <td className="py-2 px-4 border-b">
                    {order.productDescription}
                  </td>
                  <td className="py-2 px-4 border-b">{order.orderDate}</td>
                  <td className="py-2 px-4 border-b">{order.finalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BidderOrders;
