import React from "react";
import { IoCloseSharp } from "react-icons/io5";
<<<<<<< Updated upstream
=======
import EditProfile from "../pages/EditProfile";
import toast from "react-hot-toast";
>>>>>>> Stashed changes

function Profile({ onClose }) {
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");

  const handleLogout = () => {
    toast.success("Logout Successfull");
    sessionStorage.clear();
    // alert("Logout successful");
    window.location.href = "/login";
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

          <button className="w-full bg-yellow-500 mt-4 py-2 hover:bg-yellow-600 hover:scale-95 rounded-lg text-white font-semibold transition-all duration-200 ">
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
    </div>

    // <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300">
    //   <div className="p-6 flex flex-col h-full">
    //     {/* Header */}
    //     <div className="flex justify-between items-center mb-6">
    //       <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
    //       <button
    //         onClick={onClose}
    //         className="text-gray-500 hover:text-gray-700 text-xl"
    //       >
    //         <IoCloseSharp />
    //       </button>
    //     </div>

    //     {/* User Info */}
    //     <div className="space-y-4 flex-1">
    //       <p>
    //         <strong>Name:</strong> {name}
    //       </p>
    //       <p>
    //         <strong>Email:</strong> {email}
    //       </p>

    //       <button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">
    //         Edit Profile
    //       </button>
    //     </div>

    //     {/* Logout */}
    //     <button
    //       onClick={handleLogout}
    //       className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </div>
  );
}

export default Profile;
