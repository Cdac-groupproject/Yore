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
  const isCreateAuction = location.pathname === "/create-auction";
  const isAuctionList = location.pathname === "/auction-list";
  const isProductList = location.pathname === "/museummanager/productlist";
  const isProduct = location.pathname === "/museummanager/addProduct";
  const isUpcoming = location.pathname === "/upcoming";
  const isProductSummary = location.pathname === "/museummanager/orders";
  const isBidder = location.pathname === "/bidder";
  const isAddEmp = location.pathname === "/add-employee";
  const isContactUs = location.pathname === "/contact";
  const isAllUsers = location.pathname === "/all-users";
  const isMuseumArt = location.pathname === "/museum-art";
  const isBidderOrders = location.pathname === "/bidder/orders";

  const loggedInfo = sessionStorage.getItem("isLoggedIn");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const fullName = user?.fullName;
  const roleName = extractRoleName(user?.role);

  function extractRoleName(roleStr) {
    // roleStr example: "Role(roleId=3, roleName=AUCTIONEER)"
    if (typeof roleStr !== "string") return null;
    const match = roleStr.match(/roleName=([^,)]+)/);
    return match ? match[1] : null;
  }

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

          {(roleName === "BIDDER" || roleName === "AUCTIONEER") && (
            <Link
              to="/ongoing"
              className={
                isOnGoing
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              On-going Auctions
            </Link>
          )}

          {roleName === "AUCTIONEER" && (
            <Link
              to="/create-auction"
              className={
                isCreateAuction
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Create Auction
            </Link>
          )}

          {roleName === "AUCTIONEER" && (
            <Link
              to="/auction-list"
              className={
                isAuctionList
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Auction Summary
            </Link>
          )}
          {roleName === "MANAGER" && (
            <Link
              to="/museummanager/addProduct"
              className={
                isProduct
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Add Product
            </Link>
          )}
          {roleName === "MANAGER" && (
            <Link
              to="/museummanager/productlist"
              className={
                isProductList
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Product List
            </Link>
          )}

          {roleName === "BIDDER" && (
            <Link
              to="/bidder/orders"
              className={
                isBidderOrders
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Orders
            </Link>
          )}

          <Link
            to="/museum-art"
            className={
              isMuseumArt
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Artifacts
          </Link>

          {/* <Link
            to="/ongoing"
            className={
              isOnGoing
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            On-going Auctions
          </Link> */}
          {/*<Link
            to="/upcoming"
            className={
              isUpcoming
                ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1"
                : "text-gray-700 hover:text-yellow-700"
            }
          >
            Upcoming Auctions
          </Link>*/}

          {/* {(roleName === "BIDDER" || roleName === "") && ( */}

          {roleName === "MANAGER" && (
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
          )}
          {roleName === "MANAGER" && (
            <Link
              to="/museummanager/orders"
              className={
                isProductSummary
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Product Summary
            </Link>
          )}

          {/* {(roleName === "BIDDER" || roleName === "") && ( */}
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

          {roleName === "ADMIN" && (
            <Link
              to="/all-users"
              className={
                isAllUsers
                  ? "text-yellow-700 font-semibold border-b-2 border-yellow-700 pb-1 transition-all duration-200"
                  : "text-gray-700 hover:text-yellow-700"
              }
            >
              Users List
            </Link>
          )}
        </div>

        {/* Search + Auth Buttons */}

        <div className="flex items-center gap-4">
          {/* below line is for search */}
          {/* <FiSearch className="text-orange-600 text-lg cursor-pointer" /> */}
          {loggedInfo ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1.5 rounded-2xl">
                {fullName}
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
