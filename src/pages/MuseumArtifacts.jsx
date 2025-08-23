import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function MuseumArtifacts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Extract role from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));
  const fullName = user?.fullName;
  const roleName = extractRoleName(user?.role);

  function extractRoleName(roleStr) {
    // roleStr example: "Role(roleId=3, roleName=AUCTIONEER)"
    if (typeof roleStr !== "string") return null;
    const match = roleStr.match(/roleName=([^,)]+)/);
    return match ? match[1] : null;
  }

  const apiUrl = "http://localhost:5000/api/product";

  // Fetch all products
  const getProducts = async () => {
    try {
      const res = await axios.get(apiUrl);
      setProducts(res.data);
    } catch (error) {
      console.log("Error fetching products: ", error);
      toast.error("Failed to load products");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      toast.success("Product deleted");
      getProducts();
    } catch (error) {
      console.log("Error deleting product: ", error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6">
          Museum Artifacts
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="font-semibold text-indigo-600">₹{item.price}</p>

                {/* Delete button only for ADMIN */}
                {roleName === "ADMIN" && (
                  <button
                    onClick={() => deleteProduct(item.id)}
                    className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Button for ADMIN */}
        {roleName === "ADMIN" && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/add-artifact")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              ➕ Add Product
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default MuseumArtifacts;
