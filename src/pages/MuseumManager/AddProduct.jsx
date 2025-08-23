// import React, { useEffect, useState } from "react";
// import Navbar from "../../components/Navbar";
// import { loadBootstrap, unloadBootstrap } from "../../utils/loadBootStrap";
// import Select from "react-select/creatable";
// import axios from "axios";
// import { getAllCategories, getAllCountries } from "../../services/productService";

// function AddProduct() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [yearMade, setYearMade] = useState("");
//   const [imageFiles, setImageFiles] = useState([]);

//   const [categories, setCategories] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     loadBootstrap();
//     getCategories();
//     getCountries();
//     return () => unloadBootstrap();
//   }, []);

//   const getCategories = async () => {
//     try {
//       const res = await getAllCategories();
//       setCategories(res.map(cat => ({
//         value: cat.categoryId,
//         label: cat.name
//       })));
//     } catch (err) {
//       console.error("Error fetching categories", err);
//     }
//   };

//   const getCountries = async () => {
//     try {
//       const res = await getAllCountries();
//       setCountries(res.map(c => ({
//         value: c.countryId,
//         label: c.countryName
//       })));
//     } catch (err) {
//       console.error("Error fetching countries", err);
//     }
//   };


//   const handleCreateCategory = async (inputValue) => {
//     try {
//       const newCategory = await createCategory(inputValue);
//       const option = {
//         value: newCategory.categoryId,
//         label: newCategory.name,
//       };
//       setCategories((prev) => [...prev, option]);
//       setSelectedCategory(option);
//       toast.success(`Category "${inputValue}" created successfully!`);
//     } catch (err) {
//       console.error("Error creating category", err);
//       toast.error("Failed to create category.");
//     }
//   };

//   const handleCreateCountry = async (inputValue) => {
//     try {
//       const newCountry = await createCountry(inputValue);
//       const option = {
//         value: newCountry.countryId,
//         label: newCountry.countryName,
//       };
//       setCountries((prev) => [...prev, option]);
//       setSelectedCountry(option);
//       toast.success(`Country "${inputValue}" created successfully!`);
//     } catch (err) {
//       console.error("Error creating country", err);
//       toast.error("Failed to create country.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedCategory || !selectedCountry) {
//       alert("Please select or create both category and country.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("categoryId", selectedCategory.value);
//     formData.append("countryOfOriginId", selectedCountry.value);
//     formData.append("yearMade", yearMade);
//     imageFiles.forEach(file => formData.append("imageFiles", file));

//     try {
//       await axios.post("http://localhost:8080/manager/products/create", formData, {
//         headers: { 
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`, 
//         },
//       });
//       alert("Product added successfully!");

//       // ✅ Reset form after adding product
//       setName("");
//       setDescription("");
//       setPrice("");
//       setYearMade("");
//       setImageFiles([]);
//       setSelectedCategory(null);
//       setSelectedCountry(null);

//     } catch (err) {
//       console.error("Error adding product", err);
//       alert("Failed to add product.");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={{ backgroundColor: "#f8f1e4", padding: "20px", fontFamily: "'Playfair Display', serif" }}>
//         <div className="d-flex justify-content-center align-items-center min-vh-100">
//           <div 
//             className="card p-4 shadow-lg" 
//             style={{
//               maxWidth: "650px",
//               width: "100%",
//               backgroundColor: "#fdf6ec",
//               border: "2px solid #d4a373",
//               borderRadius: "12px",
//               boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
//             }}
//           >
//             <h2 
//               className="text-center mb-4" 
//               style={{
//                 fontFamily: "'Cinzel Decorative', serif",
//                 color: "#6a4e42",
//                 fontWeight: "bold"
//               }}
//             >
//                Add Museum Product
//             </h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">Name of the Product</label>
//                 <input
//                   type="text"
//                   className="form-control border-0"
//                   style={{ backgroundColor: "#ffffff" }}
//                   placeholder="Enter product name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control border-0"
//                   style={{ backgroundColor: "#ffffff" }}
//                   rows="3"
//                   placeholder="Enter product description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Price</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="form-control border-0"
//                   style={{ backgroundColor: "#ffffff" }}
//                   placeholder="Enter price"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Category</label>
//                 <Select
//                   options={categories}
//                   value={selectedCategory}
//                   onChange={setSelectedCategory}
//                   onCreateOption={handleCreateCategory}
//                   isClearable
//                   isSearchable
//                   placeholder="Select or type to add category"
//                   formatCreateLabel={(input) => `Add "${input}"`}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Country of Origin</label>
//                 <Select
//                   options={countries}
//                   value={selectedCountry}
//                   onChange={setSelectedCountry}
//                   onCreateOption={handleCreateCountry}
//                   isClearable
//                   isSearchable
//                   placeholder="Select or type to add country"
//                   formatCreateLabel={(input) => `Add "${input}"`}
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Year of Manufacture</label>
//                 <input
//                   type="number"
//                   className="form-control border-0"
//                   style={{ backgroundColor: "#ffffff" }}
//                   placeholder="Enter year"
//                   value={yearMade}
//                   onChange={(e) => setYearMade(e.target.value)}
//                   min="1000"
//                   max="2025"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="form-label">Add Photos</label>
//                 <input
//                   type="file"
//                   className="form-control border-0"
//                   style={{ backgroundColor: "#ffffff" }}
//                   multiple
//                   onChange={(e) => setImageFiles(Array.from(e.target.files))}
//                 />
//               </div>

//               <div className="text-end">
//                 <button 
//                   type="submit" 
//                   className="btn px-4" 
//                   style={{ backgroundColor: "#6a4e42", color: "#fff" }}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;


// src/pages/manager/AddProduct.jsx
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
import toast from "react-hot-toast";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [yearMade, setYearMade] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    getCategories();
    getCountries();
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
      console.error("Error fetching categories", err);
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
      console.error("Error fetching countries", err);
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
      toast.success(`Category "${inputValue}" created successfully!`);
    } catch (err) {
      console.error("Error creating category", err);
      toast.error("Failed to create category.");
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
      toast.success(`Country "${inputValue}" created successfully!`);
    } catch (err) {
      console.error("Error creating country", err);
      toast.error("Failed to create country.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedCountry) {
      alert("Please select or create both category and country.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", selectedCategory.value);
    formData.append("countryOfOriginId", selectedCountry.value);
    formData.append("yearMade", yearMade);
    imageFiles.forEach((file) => formData.append("imageFiles", file));

    try {
      await axios.post("http://localhost:8080/manager/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setYearMade("");
      setImageFiles([]);
      setSelectedCategory(null);
      setSelectedCountry(null);
    } catch (err) {
      console.error("Error adding product", err);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f1e4]">
      <Navbar />
      <div className="flex justify-center items-center p-6">
        <div className="w-full max-w-3xl bg-[#fdf6ec] border-2 border-[#d4a373] rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-[#6a4e42] mb-6 font-serif">
            Add Museum Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Name of the Product</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-yellow-600 focus:outline-none"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-yellow-600 focus:outline-none"
                placeholder="Enter product description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-yellow-600 focus:outline-none"
                step="0.01"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category</label>
              <Select
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                onCreateOption={handleCreateCategory}
                isClearable
                isSearchable
                placeholder="Select or type to add category"
                formatCreateLabel={(input) => `Add "${input}"`}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Country of Origin</label>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={setSelectedCountry}
                onCreateOption={handleCreateCountry}
                isClearable
                isSearchable
                placeholder="Select or type to add country"
                formatCreateLabel={(input) => `Add "${input}"`}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Year of Manufacture</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-yellow-600 focus:outline-none"
                min="1000"
                max="2025"
                placeholder="Enter year"
                value={yearMade}
                onChange={(e) => setYearMade(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Add Photos</label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-yellow-600 focus:outline-none"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
              />
            </div>

            <div className="text-end">
              <button
                type="submit"
                className="bg-[#6a4e42] text-white px-6 py-2 rounded-lg hover:bg-[#553b32] transition duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
