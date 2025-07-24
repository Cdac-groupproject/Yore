import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isAdmin, setIsAdmin] = useState(false);

  const onRegisterHandler = () => {
    if (!name || !email || !password) {
      alert("Fill all details");
      return;
    }
    // toast.success("User Register Succefully");
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    // sessionStorage.setItem("isAdmin", isAdmin);
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1] px-4 pt-20">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6 text-center">
            <img src={logo} alt="Logo" className="mx-auto h-16" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-500">Join now and start bidding!</p>
          </div>

          <form className="space-y-5" onSubmit={onRegisterHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="Paresh"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm  *:font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Below code is for admin checkbox */}
            {/* <div className="flex items-center gap-2">
              <label
                htmlFor="admin"
                className="text-sm text-gray-700 font-medium cursor-pointer"
              >
                Admin
              </label>
              <input
                type="checkbox"
                name="Admin"
                id="admin"
                className="w-4 h-4 accent-yellow-400 cursor-pointer"
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </div> */}

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-700 font-medium hover:underline"
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
