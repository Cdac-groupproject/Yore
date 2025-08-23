import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = sessionStorage.getItem("token");

  // useEffect(() => {
  //   axios.get("http://localhost:8080/orders", {headers: {Authorization: `Bearer ${token}`}})
  //     .then((res) => {
  //       setOrders(res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching orders", err);
  //     });
  // }, []);

useEffect(() => {
  axios
    .get("http://localhost:8080/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      // Defensive check: ensure res.data is an array
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]); // fallback to empty array if not
        console.warn("Expected an array but got:", res.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching orders", err);
      setOrders([]); // fallback to empty on error
    });
}, []);


  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6e3] to-[#f5e6ca] p-6 font-serif">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#5a4636] drop-shadow-lg">
         Auction Orders
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg bg-[#fff9f0] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#d2b48c] text-[#3e2f23] uppercase text-sm tracking-wider">
              <th className="p-4 border">Order ID</th>
              <th className="p-4 border">Product</th>
              <th className="p-4 border">Bidder</th>
              <th className="p-4 border">Auctioneer</th>
              <th className="p-4 border">Date</th>
              <th className="p-4 border">Final Price</th>
            </tr>
          </thead>
          {/* <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.orderId}
                className={`hover:bg-[#f0e1c6] transition duration-200 ${
                  index % 2 === 0 ? "bg-[#fffaf3]" : "bg-[#fdf3e7]"
                }`}
              >
                <td className="p-4 border text-center">{order.orderId}</td>
                <td className="p-4 border">{order.productName}</td>
                <td className="p-4 border">{order.bidderName}</td>
                <td className="p-4 border">{order.auctioneerName}</td>
                <td className="p-4 border">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="p-4 border text-right">
                  ₹{order.finalPrice.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody> */}

          <tbody>
  {orders.length === 0 ? (
    <tr>
      <td colSpan="6" className="p-4 text-center text-gray-500 italic">
        No orders found.
      </td>
    </tr>
  ) : (
    orders.map((order, index) => (
      <tr
        key={order.orderId}
        className={`hover:bg-[#f0e1c6] transition duration-200 ${
          index % 2 === 0 ? "bg-[#fffaf3]" : "bg-[#fdf3e7]"
        }`}
      >
        <td className="p-4 border text-center">{order.orderId}</td>
        <td className="p-4 border">{order.productName}</td>
        <td className="p-4 border">{order.bidderName}</td>
        <td className="p-4 border">{order.auctioneerName}</td>
        <td className="p-4 border">
          {new Date(order.orderDate).toLocaleString()}
        </td>
        <td className="p-4 border text-right">
          ₹{order.finalPrice.toLocaleString()}
        </td>
      </tr>
    ))
  )}
</tbody>


        </table>
      </div>

      <p className="mt-6 text-center text-[#7b5e44] italic">
        “Where history meets the highest bidder.”
      </p>
    </div>
    </div>
  );
}
