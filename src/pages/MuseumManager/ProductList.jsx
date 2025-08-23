import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fallbackImages = [
  "/src/assets/Homepage/car.png",
  "/src/assets/Homepage/list1.png",
  "/src/assets/Homepage/list2.jpg",
  "/src/assets/Homepage/list3.png",
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const authConfig = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/manager/products", authConfig);
        if (res.status === 200) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleUpdate = (product) => {
    navigate(`/update-product/${product.productId}`, { state: { product } });
  };

  const handleAuctionAway = async (productId) => {
    setActionLoadingId(productId);
    try {
      await axios.put(`http://localhost:8080/manager/away-for-auction/${productId}`, null, authConfig);
      toast.success("Product marked as auctioned for today.");
      setProducts(products.map(p => p.productId === productId ? { ...p, auctionedForToday: true } : p));
    } catch (error) {
      console.error("Failed to mark product for auction:", error);
      toast.error("Failed to mark product for auction.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // New: Show toast confirm with buttons for delete
  const confirmDelete = (productId, productName) => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete <strong>{productName}</strong>?</p>
        <div className="mt-2 flex gap-2 justify-end">
          <button
            onClick={() => {
              handleDelete(productId);
              toast.dismiss(toastId);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const handleDelete = async (productId) => {
    setActionLoadingId(productId);
    try {
      await axios.delete(`http://localhost:8080/manager/products/${productId}`, authConfig);
      toast.success("Product deleted successfully.");
      setProducts(products.filter(p => p.productId !== productId));
    } 
    catch (err) {
  if (err.response?.data?.message?.toLowerCase().includes("referenced in auctions")) {
    toast.error("Product is present for an auction and cannot be deleted.");
  } else {
    toast.error("Failed to delete product.");
  }
}
    // catch (error) {
    //   console.error("Failed to delete product:", error);
    //   toast.error("Failed to delete product.");
     finally {
      setActionLoadingId(null);
    }
  };

  const getSafeImages = (imageUrls) => {
    if (imageUrls && imageUrls.length > 0) return imageUrls;
    return fallbackImages;
  };

  const getImageSrc = (imgUrl) => {
    if (!imgUrl) return fallbackImages[0];
    if (imgUrl.startsWith("http")) return imgUrl;
    if (imgUrl.startsWith("/src/assets/")) return imgUrl;
    return `http://localhost:8080/${imgUrl}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-gray-500">Loading products...</div>
      </>
    );
  }

  if (!products.length) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-gray-500 ">No products found.</div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7]">
      <div className="flex items-center justify-center"></div>
      <div className="max-w-5xl  mx-auto p-6  shadow-lg rounded-lg mt-10 mb-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Museum Product List</h1>

        <div className="flex flex-col gap-6">
          {products.map((product) => {
            const safeImages = getSafeImages(product.imageUrl);
            const mainImgSrc = getImageSrc(safeImages[0]);
            const isLoading = actionLoadingId === product.productId;

            return (
              <div
                key={product.productId}
                className="flex flex-row bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                style={{ minHeight: "200px" }}
              >
                <div className="flex-shrink-0 w-56 h-56 border-r border-gray-200 overflow-hidden bg-gray-50">
                  <img
                    src={mainImgSrc}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col flex-1 p-6 justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>

                    <div className="space-y-1 text-gray-700">
                      <p>
                        <strong>Category:</strong> {product.category?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Year Made:</strong> {product.yearMade || "N/A"}
                      </p>
                      <p>
                        <strong>Price:</strong> {product.price || "N/A"}
                      </p>
                      <p>
                        <strong>Sold:</strong> {product.sold ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Country of Origin:</strong>{" "}
                        {product.countryOfOrigin?.countryName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                    <button
                      onClick={() => handleUpdate(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-4 py-2 rounded-md"
                      aria-label={`Update ${product}`}
                      disabled={isLoading}
                    >
                      Update
                    </button>

                    <button
                      onClick={() => confirmDelete(product.productId, product.name)}
                      className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-md"
                      aria-label={`Delete ${product.name}`}
                      disabled={isLoading}
                    >
                      Delete
                    </button>

                    {product.auctionedForToday ? (
                      <span className="bg-orange-300 text-orange-800 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                        Sent for Auction
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAuctionAway(product.productId)}
                        className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-md"
                        aria-label={`Send ${product.name} to auction`}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Auction Away"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductList;