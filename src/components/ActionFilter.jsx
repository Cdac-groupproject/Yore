import React from "react";
import bgImage from "../assets/actionFilter.png";
import { Link } from "react-router-dom";
function ActionFilter() {
  return (
    <div className="relative w-full h-[85vh] bg-black overflow-hidden">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Hero Background"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

      {/* Hero Text */}
      <div className="absolute top-[30%] left-[6%] z-10 text-white max-w-[600px]">
        <h1 className="text-3xl font-extrabold leading-tight mb-4">
          Discover Rare Finds,
          <br />
          Bid with Confidence!
        </h1>
        <p className="text-lg mb-6">
          Join the community of savvy collectors & secure exclusive deals on
          cars, antiques, art, and more.
        </p>
        <Link to="/ongoing">
          <button className="px-6 py-3 bg-orange-600 hover:bg-orange-700 hover:scale-95 transition-all duration-300 text-white font-semibold rounded-md shadow-md cursor-pointer">
            Check Auctions
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ActionFilter;
