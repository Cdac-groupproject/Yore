import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { getUserById, loginUser } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import Loader from "../components/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logEmail = sessionStorage.getItem("email");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      const token = res.data;

      console.log("token = " + token);

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isLoggedIn", true);

      const decoded = jwtDecode(token);
      const userId = parseInt(decoded.sub);
      console.log("user id = ", userId);
      const userRes = await getUserById(userId);
      const user = userRes.data;

      console.log("User details: ", user);

      // sessionStorage.setItem("user", JSON.stringify(user));
      const userDetails = {
        fullName: user.fullName,
        phoneNo: user.phoneNo,
        email: user.email,
        age: user.age,
        role: user.role,
        user_id: userId,
      };

      sessionStorage.setItem("user", JSON.stringify(userDetails));

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
        setLoading(false);
      }, 1000);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error("Invalid credintials");
      console.log(error);
    }
  };

  if (loading) {
    return <Loader message="Signing you in..." />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e1] px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6 text-center">
            <img src={logo} alt="Logo" className="mx-auto h-16" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Login to AuctionHub
            </h1>
            <p className="text-sm text-gray-500">Welcome back! Bid smarter.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
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
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-700 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Login;
