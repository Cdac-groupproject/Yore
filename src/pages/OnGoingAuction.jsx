import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import NewCardComp from "../components/NewCardComp";
import car from "../assets/Homepage/car.png";
import AuctionCard from "../components/AuctionCard";
import { useNavigate } from "react-router-dom";

function OnGoingAuction() {
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
      </div>
    </div>
  );
}

export default OnGoingAuction;
