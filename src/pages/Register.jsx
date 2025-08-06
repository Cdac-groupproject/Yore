import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { registerUser } from "../services/userService";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [genderId, setGenderId] = useState("");

  const onRegisterHandler = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !phoneNo || !age || !genderId) {
      toast.error("Please fill all details");
      return;
    }

    const userData = { fullName, email, password, phoneNo, age, genderId };

    try {
      const res = await registerUser(userData);
      toast.success("Otp send to you r email");
      sessionStorage.setItem("email", email);
      navigate("/otp-verification");
    } catch (error) {
      toast.error("Registration failed");
    }
    // toast.success("User Registered Successfully");
    // navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1] px-4 pt-20 font-serif">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-yellow-800">
          <div className="mb-6 text-center">
            <img src={logo} alt="Logo" className="mx-auto h-16" />
            <h1 className="text-2xl font-bold text-yellow-900 mt-4 tracking-wide">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-600 italic">
              Join now and start bidding with YORE!
            </p>
          </div>

          <form className="space-y-5" onSubmit={onRegisterHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Paresh"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0]"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Phone No.
              </label>
              <input
                type="text"
                placeholder="0123456789"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0]"
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0]"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Age
              </label>
              <input
                type="number"
                placeholder="18"
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0]"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Gender
              </label>
              <select
                value={genderId}
                onChange={(e) => setGenderId(Number(e.target.value))}
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0] text-gray-700"
              >
                <option value="">Select Gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-800 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}

export default Register;
