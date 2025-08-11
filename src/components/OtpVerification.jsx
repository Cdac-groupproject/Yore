import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/newLogo.png";
import { verifyOtp } from "../services/userService";
import Navbar from "../components/Navbar";

function OtpVerification() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("email");

  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    if (!value) return;

    const newOtp = [...otpArray];
    newOtp[index] = value[0];
    setOtpArray(newOtp);

    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];
      if (otpArray[index]) {
        newOtp[index] = "";
        setOtpArray(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpArray.join("");

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await verifyOtp(email, otp);
      toast.success("Account verified successfully!");
      sessionStorage.removeItem("email");
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
            <img
              src={logo}
              alt="Logo"
              className="mx-auto h-16 animate-pulse-slow"
            />
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
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-800 text-center">
                Enter OTP
              </label>
              <div className="flex justify-center gap-3 mt-1">
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-12 h-14 rounded-xl border border-yellow-700 text-center text-xl bg-[#fffaf0] focus:outline-none focus:ring-2 focus:ring-yellow-600 shadow-sm transition-transform duration-150 ease-in-out focus:scale-110"
                  />
                ))}
              </div>
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
