import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";

export default function AddAuctionPage() {
  const [products, setProducts] = useState([]);
  const [auctioneers, setAuctioneers] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    auctioneerId: "",
    startTime: "",
    endTime: "",
    durationMinutes: "",
    basePrice: ""
  });
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    axios
      .get("http://localhost:8080/auctioneer/auction-products", authConfig)
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Error fetching products"));

    axios
      .get("http://localhost:8080/auctioneer/auctioneers", authConfig)
      .then(res => setAuctioneers(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Error fetching auctioneers"));
  }, [token]);

  // Handle input changes with auto-calculation
  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => {
      let updated = { ...prev, [name]: value };

      // Auto-calc endTime if duration changes
      if (name === "durationMinutes" && value && prev.startTime) {
        const start = new Date(prev.startTime);
        if (!isNaN(start.getTime())) {
          const end = new Date(start.getTime() + Number(value) * 60000);
          updated.endTime = end.toISOString().slice(0, 16);
        }
      }

      // Auto-calc duration if endTime changes
      if (name === "endTime" && value && prev.startTime) {
        const start = new Date(prev.startTime);
        const end = new Date(value);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
          const minutes = Math.round((end - start) / 60000);
          updated.durationMinutes = minutes.toString();
        }
      }

      // Auto-calc endTime if startTime changes and duration is set
      if (name === "startTime" && prev.durationMinutes) {
        const start = new Date(value);
        if (!isNaN(start.getTime())) {
          const end = new Date(start.getTime() + Number(prev.durationMinutes) * 60000);
          updated.endTime = end.toISOString().slice(0, 16);
        }
      }

      return updated;
    });
  };

  // Frontend validation based on DTO rules
  const validateForm = () => {
    const errors = [];

    if (!formData.productId) errors.push("Product ID is required.");
    if (!formData.auctioneerId) errors.push("Auctioneer ID is required.");

    if (!formData.startTime) {
      errors.push("Start time is required.");
    } else if (new Date(formData.startTime) <= new Date()) {
      errors.push("Start time must be in the future.");
    }

    if (!formData.endTime) {
      errors.push("End time is required.");
    } else if (new Date(formData.endTime) <= new Date()) {
      errors.push("End time must be in the future.");
    } else if (formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.push("End time must be after start time.");
    }

    if (formData.durationMinutes && Number(formData.durationMinutes) <= 0) {
      errors.push("Duration must be positive.");
    }

    if (!formData.basePrice) {
      errors.push("Base price is required.");
    } else if (Number(formData.basePrice) <= 0) {
      errors.push("Base price must be greater than zero.");
    }

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/auctioneer/auctions/create",
        formData,
        authConfig
      );
      toast.success(res.data.message || "Auction created successfully!");
      setFormData({
        productId: "",
        auctioneerId: "",
        startTime: "",
        endTime: "",
        durationMinutes: "",
        basePrice: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fdf6ec] min-h-screen flex items-center justify-center px-30 py-5">
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 mb-10">
          <ToastContainer />
          <h2 className="text-2xl font-bold mb-6 text-center">Create Auction</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Dropdown */}
            <div>
              <label className="block mb-1 font-medium">Product</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Product</option>
                {products.map(prod => (
                  <option key={`prod-${prod.productId}`} value={prod.productId}>
                    {prod.name} - ₹{prod.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Auctioneer Dropdown */}
            <div>
              <label className="block mb-1 font-medium">Auctioneer</label>
              <select
                name="auctioneerId"
                value={formData.auctioneerId}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Auctioneer</option>
                {auctioneers.map(a => (
                  <option key={`auctioneer-${a.userId}`} value={a.userId}>
                    {a.fullName} ({a.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block mb-1 font-medium">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block mb-1 font-medium">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-1 font-medium">Duration (Minutes)</label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                min="1"
              />
            </div>

            {/* Base Price */}
            <div>
              <label className="block mb-1 font-medium">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                min="0"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create And Start Auction"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
