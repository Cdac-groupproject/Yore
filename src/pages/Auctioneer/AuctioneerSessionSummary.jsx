import React from "react";
import Navbar from "../../components/Navbar";

function AuctionSummaryPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fdf6ec] py-10 px-4">
        <h3 className="text-2xl font-bold mb-6 text-center text-[#5e3b1e]">
          Auction Summary
        </h3>
<div className="overflow-x-auto p-4">
  <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-md rounded-lg">
    <thead className="bg-primary-600">
      <tr>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Id</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Name</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Product Name</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Author Id</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Payment Status</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Delivery Status</th>
        <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Auctioneer</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">1</td>
        <td className="px-6 py-4 whitespace-nowrap">Pranit</td>
        <td className="px-6 py-4 whitespace-nowrap">Paresh</td>
        <td className="px-6 py-4 whitespace-nowrap">2</td>
        <td className="px-6 py-4 whitespace-nowrap">done</td>
        <td className="px-6 py-4 whitespace-nowrap">not yet</td>
        <td className="px-6 py-4 whitespace-nowrap">Vikrant</td>
      </tr>
    </tbody>
  </table>
</div>

      </div>
    </>
  );
}

export default AuctionSummaryPage;
