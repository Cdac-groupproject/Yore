import React from "react";
import { FaLinkedin, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import logo from "../assets/newLogo.png";

function Footer() {
  return (
    <footer className="bg-white border-t py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="Logo" className="h-14 w-16" />
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300 h-16" />

        {/* Links Section */}
        <div className="flex flex-col items-center text-center px-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-700 font-medium">
            <a href="#">Terms & Condition</a>
            <a href="#">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Copyright ©2025. All rights are reserved
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300 h-16" />

        {/* Social Icons */}
        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm font-semibold text-red-600 mb-2">
            Social Accounts
          </p>
          <div className="flex gap-4 text-2xl">
            <a
              href="#"
              className="text-blue-700 hover:scale-110 transition-transform"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-blue-600 hover:scale-110 transition-transform"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-black hover:scale-110 transition-transform"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
