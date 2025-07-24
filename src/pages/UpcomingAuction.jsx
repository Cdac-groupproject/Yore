import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import AuctionCard from "../components/AuctionCard";
import car from "../assets/Homepage/car.png";
import paint from "../assets/Homepage/list2.jpg";
import { useNavigate } from "react-router-dom";

function UpcomingAuction() {
  const navigate = useNavigate();
  useEffect(() => {
    const loggeInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggeInInfo) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <Navbar />

      <div>
        <AuctionCard
          image={car}
          title="Vintage Car Aution"
          autioneer="Vikrant kale"
          sdate="25-07-2025"
          edate="27-07-2025"
        />
        <AuctionCard
          image={paint}
          title="Paint Aution"
          autioneer="Pranit"
          sdate="25-08-2025"
          edate="27-08-2025"
        />
      </div>
    </div>
  );
}

export default UpcomingAuction;
