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

  const token = localStorage.getItem("token");
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
      .catch(err => toast.error("Error fetching products"));

    axios
      .get("http://localhost:8080/auctioneer/auctioneers", authConfig)
      .then(res => setAuctioneers(Array.isArray(res.data) ? res.data : []))
      .catch(err => toast.error("Error fetching auctioneers"));
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    // Only one of endTime or durationMinutes should be required
    if (!formData.endTime && !formData.durationMinutes) {
      toast.error("Please provide either End Time or Duration (Minutes).");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/auctioneer/auctions/create", formData, authConfig);
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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10 mb-10 ">
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
            {loading ? "Creating..." : "Create Auction"}
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
