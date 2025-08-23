import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Select from "react-select/creatable";
import axios from "axios";
import {
  getAllCategories,
  getAllCountries,
  createCategory,
  createCountry,
} from "../../services/productService";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [yearMade, setYearMade] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [sold, setSold] = useState(false);
  const [auctionedForToday, setAuctionedForToday] = useState(false);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    getCategories();
    getCountries();
    fetchProduct();
  }, []);

  const getCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(
        res.map((cat) => ({
          value: cat.categoryId,
          label: cat.name,
        }))
      );
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  const getCountries = async () => {
    try {
      const res = await getAllCountries();
      setCountries(
        res.map((c) => ({
          value: c.countryId,
          label: c.countryName,
        }))
      );
    } catch (err) {
      toast.error("Error fetching countries");
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/manager/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const product = res.data;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setYearMade(product.yearMade);
      setSold(product.sold);
      setAuctionedForToday(product.auctionedForToday);

      if (product.category) {
        setSelectedCategory({
          value: product.category.categoryId,
          label: product.category.name,
        });
      }
      if (product.countryOfOrigin) {
        setSelectedCountry({
          value: product.countryOfOrigin.countryId,
          label: product.countryOfOrigin.countryName,
        });
      }
    } catch (err) {
      toast.error("Error fetching product details");
    }
  };

  const handleCreateCategory = async (inputValue) => {
    try {
      const newCategory = await createCategory(inputValue);
      const option = {
        value: newCategory.categoryId,
        label: newCategory.name,
      };
      setCategories((prev) => [...prev, option]);
      setSelectedCategory(option);
      toast.success("Category created successfully");
    } catch (err) {
      toast.error("Error creating category");
    }
  };

  const handleCreateCountry = async (inputValue) => {
    try {
      const newCountry = await createCountry(inputValue);
      const option = {
        value: newCountry.countryId,
        label: newCountry.countryName,
      };
      setCountries((prev) => [...prev, option]);
      setSelectedCountry(option);
      toast.success("Country created successfully");
    } catch (err) {
      toast.error("Error creating country");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedCountry) {
      toast.error("Please select or create both category and country.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", selectedCategory.value);
    formData.append("countryOfOriginId", selectedCountry.value);
    formData.append("yearMade", yearMade);
    formData.append("sold", sold);
    formData.append("auctionedForToday", auctionedForToday);
    imageFiles.forEach((file) => formData.append("imageFiles", file));

    try {
      await axios.put(
        `http://localhost:8080/manager/products/${productId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product updated successfully!");
      navigate("/museummanager/productlist");
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-[#f8f1e4] p-5 font-serif min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl bg-[#fdf6ec] border-2 border-[#d4a373] rounded-xl shadow-lg p-6">
          <h2 className="text-center mb-6 font-[Cinzel] text-[#6a4e42] font-bold text-2xl">
            Update Museum Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">Name of the Product</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Price */}
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Category</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                onCreateOption={handleCreateCategory}
                isClearable
                isSearchable
              />
            </div>

            {/* Country */}
            <div>
              <label className="block font-medium mb-1">Country of Origin</label>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={setSelectedCountry}
                onCreateOption={handleCreateCountry}
                isClearable
                isSearchable
              />
            </div>

            {/* Year */}
            <div>
              <label className="block font-medium mb-1">Year of Manufacture</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
                value={yearMade}
                onChange={(e) => setYearMade(e.target.value)}
                min="0"
                max="2025"
                required
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block font-medium mb-1">Update Photos</label>
              <input
                type="file"
                multiple
                className="w-full border border-gray-300 rounded-md bg-white file:mr-4 file:py-2 file:px-4 
                           file:rounded-md file:border-0 file:text-sm file:font-semibold
                           file:bg-[#6a4e42] file:text-white hover:file:bg-[#5b3e36]"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-[#6a4e42] text-white rounded-lg hover:bg-[#5b3e36] transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default UpdateProduct;
