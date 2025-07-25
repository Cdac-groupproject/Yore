import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import EditProfile from "../pages/EditProfile";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Profile({ onClose }) {
  const [showModal, setShowmodal] = useState(false);

  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    console.log("isADmin = ", isAdmin);
  }, []);

  const handleLogout = () => {
    toast.success("Logout Successfull");
    sessionStorage.clear();
    // alert("Logout successful");
    window.location.href = "/login";
  };

  const handleSave = ({ name: updatedName, email: updatedEmail }) => {
    sessionStorage.setItem("name", updatedName);
    sessionStorage.setItem("email", updatedEmail);
    // setName(updatedName);
    // setEmail(updatedEmail);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white z-20">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl text-gray-800 font-semibold">User Profile</h2>
          <button
            className="text-gray-500 hover:text-gray-800  text-xl"
            onClick={onClose}
          >
            <IoCloseSharp />
          </button>
        </div>

        {/* Below line is for horizontal line */}
        <hr className="border-t border-gray-300 my-3" />

        <div className="space-y-4 flex-1">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>

          <hr className="border-t border-gray-300 my-3" />
          {isAdmin && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Admin Links
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <Link
                  to="/auctioneer/upcoming"
                  className="text-gray-700 hover:text-yellow-600"
                >
                  Upcoming Auction
                </Link>
                <Link
                  to="/auctioneer/summary"
                  className="text-gray-700 hover:text-yellow-600"
                >
                  Auction Summary
                </Link>
                <Link
                  to="/auctioneer/ongoing"
                  className="text-gray-700 hover:text-yellow-600"
                >
                  Ongoing Auction
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowmodal(true)}
            className="w-full bg-yellow-500 mt-4 py-2 hover:bg-yellow-600 hover:scale-95 rounded-lg text-white font-semibold transition-all duration-200 "
          >
            Edit Profile
          </button>
        </div>

        <hr className="border-t border-gray-300 my-3" />

        <button
          className="w-full py-2 bg-red-500 mx-auto text-white rounded-lg font-semibold hover:bg-red-600 hover:scale-95 transition-all duration-200"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <EditProfile
        isOpen={showModal}
        onClose={() => setShowmodal(false)}
        uname={name}
        uemail={email}
        onSave={handleSave}
      />
    </div>
  );
}

export default Profile;
