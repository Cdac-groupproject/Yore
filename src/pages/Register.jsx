import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");

  const onRegisterHandler = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !phone || !age || !gender) {
      toast.error("Please fill all details");
      return;
    }

    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("phone", phone);
    sessionStorage.setItem("age", age);
    sessionStorage.setItem("gender", gender);

    toast.success("User Registered Successfully");
    navigate("/login");
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
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
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-[#fffaf0] text-gray-700"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
