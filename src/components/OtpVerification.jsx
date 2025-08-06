import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/newLogo.png";
import { verifyOtp } from "../services/userService";
import Navbar from "../components/Navbar";

function OtpVerification() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email"); // Get email passed from registration
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await verifyOtp(email, otp);
      toast.success("Account verified successfully!");
      sessionStorage.removeItem("email"); // cleanup
      navigate("/login");
    } catch (err) {
      toast.error("Invalid OTP or verification failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1] px-4 pt-20 font-serif">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-yellow-800">
          <div className="mb-6 text-center">
            <img src={logo} alt="Logo" className="mx-auto h-16" />
            <h2 className="text-2xl font-bold text-yellow-900 mt-4">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We’ve sent a 6-digit OTP to your email:
              <br />
              <span className="font-medium text-yellow-900">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="e.g. 123456"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-lg tracking-widest text-center bg-[#fffaf0]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default OtpVerification;
