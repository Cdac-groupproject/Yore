import React, { useEffect, useState } from "react";
import logo from "../assets/newLogo.png"; // Make sure path matches your asset folder
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loggeInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggeInInfo) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [navigate]);
  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7] py-16 px-4">
        <div className="bg-white/90 backdrop-blur-lg border border-[#c4b7a6] rounded-3xl shadow-2xl flex flex-col items-center max-w-xl w-full p-8 md:p-12">
          <img
            src={logo}
            alt="YORE logo"
            className="h-24 w-auto mb-4 opacity-90 drop-shadow"
            style={{ filter: "drop-shadow(0 6px 8px #c4b7a6cc)" }}
          />
          <h1 className="font-playfair text-4xl text-[#332214] font-extrabold mb-2 tracking-tight text-center">
            Contact YORE
          </h1>
          <p className="text-[#544333] text-center mb-8">
            We're here to help you find your own rare estate.
            <br />
            Send us a message and our dedicated team will respond soon.
          </p>
          <form
            className="space-y-5 w-full"
            onSubmit={(e) => {
              e.preventDefault();
              // alert("Thank you for reaching out!");
              toast.success("Thanks for reaching out! We'll respond shortly.");
              console.log("email  = ", email);
              console.log("name = ", fullName);
              console.log("message = ", message);
              navigate("/");
            }}
          >
            <div>
              <label className="block text-[#795b33] font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                placeholder="Jane Doe"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
            </div>
            <div>
              <label className="block text-[#795b33] font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                placeholder="you@email.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label className="block text-[#795b33] font-medium mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                placeholder="How may we help you?"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#b59f77] via-[#e9dfc4] to-[#827058] text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
            >
              Send Message
            </button>
          </form>
          <div className="mt-8 text-[#b59f77] text-xs text-center">
            YORE • Your Own Rare Estate
            <br />
            <span className="italic">Crafted with Perplexity</span>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
