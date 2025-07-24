import React from 'react';
import Navbar from '../../components/Navbar';
import image from '../../assets/Homepage/car.png'
const AuctioneerOngoingPage = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-body">
      {/* Image Section */}
      <div className="w-full md:w-1/2 p-4 flex justify-center bg-white">
        <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-lg shadow-xl transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={image}
            alt="Auction Item"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Active Auction
            </span>
          </div>
        </div>
      </div>

      {/* Auction Details Section */}
      <div className="w-full md:w-1/2 p-6 md:p-10 bg-white shadow-lg">
        

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Description</label>
            <textarea
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            placeholder="Enter item description"
            rows="3"
            />
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Base Price:</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <span className="text-xl font-semibold">$120,000</span>
            </div>
          </div>

          {/* Current Price */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Current Price:</label>
            <div className="flex items-center bg-primary-50 p-3 rounded-lg border-l-4 border-primary-500">
              <span className="text-xl font-semibold text-primary-700">$145,500</span>
            </div>
          </div>

          {/* Highest Bidder */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Highest Bidder:</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center mr-3">
              </div>
              <span className="text-xl font-semibold">John Doe</span>
            </div>
          </div>


        {/* for bidder's pov to bid the amount. Add "items-center" to image section div to make it look good */}
        {/* <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">Bid Price</label>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center mr-3">
                </div>
                <input
                type="text"
                className="text-xl font-semibold bg-transparent focus:outline-none focus:ring-0"
                />
            </div>
        </div> */}


          {/* Terminate Auction Button */}
          <button
            className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center"
          >
            <span className="material-symbols-outlined mr-2"></span> Terminate Auction
          </button>
        </div>
      </div>
    </div>
  </>);
};

export default AuctioneerOngoingPage;
