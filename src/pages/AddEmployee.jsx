import React, { useState, useEffect } from "react";

// Replace with your real logo import
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const mockCategories = [
  { emp_cat_id: 1, emp_cat_name: "Admin" },
  { emp_cat_id: 2, emp_cat_name: "Auctioneer" },
  { emp_cat_id: 3, emp_cat_name: "Support" },
];

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const loggeInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggeInInfo) {
      navigate("/login");
    }
  }, [navigate]);

  // Simulate fetching categories (replace with real API call if you have backend)
  useEffect(() => {
    // fetch('/api/employee-categories').then(...)
    setCategories(mockCategories);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // Here you'd POST to your backend API
    console.log({ name, email, category }); // remove in prod!
    setSubmitted(true);
    setName("");
    setEmail("");
    setCategory("");
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7] py-16 px-4">
        <div className="bg-white/90 backdrop-blur-lg border border-[#c4b7a6] rounded-3xl shadow-2xl flex flex-col items-center max-w-xl w-full p-8 md:p-12">
          <img
            src={logo}
            alt="YORE logo"
            className="h-20 w-auto mb-4 opacity-90 drop-shadow"
            style={{ filter: "drop-shadow(0 6px 8px #c4b7a6cc)" }}
          />
          <h1 className="font-playfair text-3xl text-[#332214] font-extrabold mb-2 tracking-tight text-center">
            Add Employee
          </h1>
          <p className="mb-8 text-[#604a2f] text-center">
            Register a new team member below—select their role and enter their
            info.
          </p>
          {submitted && (
            <div className="w-full mb-4 text-green-700 text-center bg-green-100 py-2 rounded shadow">
              Employee added successfully!
            </div>
          )}
          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#795b33] font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={name}
                placeholder="e.g., Priya Sharma"
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                placeholder="e.g., priya@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#795b33] font-medium mb-1">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16] cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.emp_cat_id} value={cat.emp_cat_id}>
                    {cat.emp_cat_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#b59f77] via-[#e9dfc4] to-[#827058] text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
            >
              Add Employee
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
