import React, { useState } from "react";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
      setError("");
      alert(`Entered OTP: ${fullOtp}`);
    } else {
      setError("Please enter all 6 digits of the OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-[#fdf6e3]">
      <div className="bg-[#fffaf0] border border-yellow-700 shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md font-serif">
        <h1 className="text-3xl font-bold text-yellow-900 mb-3 text-center tracking-wide">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-700 text-center mb-8 italic">
          A 6-digit code has been sent to your email
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-12 h-14 text-center text-xl border border-yellow-800 rounded-md shadow-md bg-[#fff8dc] text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-700 transition-all duration-150"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          className="w-full bg-yellow-900 hover:bg-yellow-800 text-white py-2 rounded-lg text-lg tracking-wide transition duration-200 shadow-md"
        >
          Verify OTP
        </button>

        <button
          onClick={() => window.history.back()}
          className="mt-4 w-full text-yellow-900 hover:underline text-sm text-center"
        >
          ← Back to Registration
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
