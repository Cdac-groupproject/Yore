import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiUser } from "react-icons/fi";
import logo from "../assets/newLogo.png";
import Profile from "./Profile";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname == "/login";
  const isHome = location.pathname === "/";
  const isOnGoing = location.pathname === "/ongoing";
  const isUpcoming = location.pathname === "/upcoming";
  const isBidder = location.pathname === "/bidder";
  const isAddEmp = location.pathname === "/add-employee";
  const isContactUs = location.pathname === "/contact";

  const loggedInfo = sessionStorage.getItem("isLoggedIn");
  const username = sessionStorage.getItem("name");

  // const onProfileClick = () => {
  //   navigate("/profile");
  // };

  // const logoutHandler = () => {
  //   sessionStorage.clear();
  //   alert("Logout successfull");
  //   navigate("/login");
  // };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-white">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-14 w-16" />
            <span className="text-xl font-bold tracking-wide text-gray-800">
              YORE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link
            to="/"
            className={
              isHome
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Home
          </Link>
          <Link
            to="/ongoing"
            className={
              isOnGoing
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            On-going Auctions
          </Link>
          <Link
            to="/upcoming"
            className={
              isUpcoming
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Upcoming Auctions
          </Link>

          <Link
            to="/contact"
            className={
              isContactUs
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Contact Us
          </Link>

          <Link
            to="/add-employee"
            className={
              isAddEmp
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Add Employee
          </Link>
        </div>

        {/* Search + Auth Buttons */}

        <div className="flex items-center gap-4">
          {/* below line is for search */}
          {/* <FiSearch className="text-orange-600 text-lg cursor-pointer" /> */}
          {loggedInfo ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1.5 rounded-2xl">
                {username}
              </span>
              <button onClick={() => setShowProfile(true)}>
                <FiUser className="w-6 h-6 text-gray-700 hover:text-yellow-700 transition-all duration-200 " />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
}

export default Navbar;
