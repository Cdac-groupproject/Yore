import React from "react";
import Navbar from "../components/Navbar";
import ActionFilter from "../components/ActionFilter";
import list1 from "../assets/Homepage/list1.png";
import list2 from "../assets/Homepage/list2.jpg";
import list3 from "../assets/Homepage/list3.png";
import list4 from "../assets/Homepage/list4.png";
import car from "../assets/Homepage/car.png";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <ActionFilter />
      <AboutUs />
      <section className="px-4 py-10 max-w-7xl mx-auto">
        {/* Auction Categories */}
        <h2 className="text-2xl font-semibold mb-6">Auction Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Car Auctions", image: list1 },
            { title: "Painting Auctions", image: list2 },
            {
              title: "Electronic Auctions",
              image: list3,
            },
            {
              title: "Exotic Clothing Auction",
              image: list4,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative rounded-lg overflow-hidden group "
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                <p className="text-white font-medium w-full">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Auction */}
        <h2 className="text-2xl font-semibold mt-12 mb-6">Featured Auctions</h2>
        {/* <div className="relative bg-black text-white rounded-xl overflow-hidden shadow-lg h-1/2">
          <img
            src={car}
            alt="Featured Car"
            className="w-full h-80 object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Classic 1985 Toyota{" "}
              <span className="text-orange-500">Land Cruiser.</span>
            </h3>
            <p className="mt-2 text-sm sm:text-base max-w-xl">
              This 1985 Toyota Land Cruiser is a testament to Toyota’s legacy of
              engineering excellence. Perfect for collectors, adventurers.
            </p>

            <div className="mt-4 text-sm space-y-1">
              <p className="text-orange-400 font-semibold">Key Features</p>
              <p>
                Iconic Design: The 1985 model · Off-Road Mastery: 4x4
                capabilities
              </p>

              <p className="mt-2 text-orange-400 font-semibold">
                Auction Highlights
              </p>
              <p>Well Maintained · Low Mileage · Detailed Documentation</p>
            </div>

            <button className="mt-4 w-fit bg-orange-500 text-white px-5 py-2 rounded-full text-sm hover:bg-orange-600 transition">
              Bid In Auction
            </button>
          </div>
        </div> */}
        <div className="relative bg-black text-white rounded-xl overflow-hidden shadow-lg h-[420px] sm:h-[460px]">
          <img
            src={car}
            alt="Featured Car"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Classic 1985 Toyota{" "}
              <span className="text-orange-500">Land Cruiser.</span>
            </h3>

            <p className="text-sm sm:text-base max-w-xl">
              This 1985 Toyota Land Cruiser is a testament to Toyota’s legacy of
              engineering excellence. Perfect for collectors, adventurers.
            </p>

            <div className="text-sm space-y-2">
              <div>
                <p className="text-orange-400 font-semibold">Key Features</p>
                <p>
                  Iconic Design: The 1985 model · Off-Road Mastery: 4x4
                  capabilities
                </p>
              </div>

              <div>
                <p className="text-orange-400 font-semibold mt-2">
                  Auction Highlights
                </p>
                <p>Well Maintained · Low Mileage · Detailed Documentation</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/bidder")}
              className="w-fit bg-orange-500 text-white px-5 py-2 rounded-full text-sm hover:bg-orange-600 transition-all hover:scale-95 duration-200"
            >
              Bid In Auction
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
