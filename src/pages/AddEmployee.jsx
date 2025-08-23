import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoles, getGenders } from "../services/userService";
import { myAxios } from "../services/config";
import { Link } from "react-router-dom";
import logo from "../assets/newLogo.png"; // import your logo image


export default function AddEmployee() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    age: "",
    gender: "", // genderId as string
    role: "",   // roleId as string
  });

  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    getGenders()
      .then((res) => setGenders(res.data))
      .catch((err) => console.error("Error fetching genders:", err));

    getRoles()
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));

    // Prefill form if navigating with state (for editing)
    if (location.state && location.state.user) {
      const user = location.state.user;
      setIsEditing(true);
      setEditingUserId(user.userId);
      setFormData({
        fullName: user.fullName || "",
        phone: user.phoneNo || "",
        email: user.email || "",
        password: "", // don't prefill password
        age: user.age ? String(user.age) : "",
        gender: user.gender?.genderId ? String(user.gender.genderId) : "",
        role: user.role?.roleId ? String(user.role.roleId) : "",
      });
    }
  }, [location.state]);

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      role: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fullName: formData.fullName,
      phoneNo: formData.phone,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age, 10),
      genderId: parseInt(formData.gender, 10),
      roleId: parseInt(formData.role, 10),
    };

    try {
      if (isEditing) {
        await myAxios.put(`/api/users/${editingUserId}`, payload);
        alert("Employee updated successfully!");
      } else {
        await myAxios.post("/api/users/manager/addEmployee", payload);
        alert("Employee added successfully!");
      }
      cancelEdit();
      navigate("/employees"); // Redirect to employees table after add/update
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7] py-16 px-4">
        <div className="bg-white/90 backdrop-blur-lg border border-[#c4b7a6] rounded-3xl shadow-2xl flex flex-col items-center max-w-lg w-full p-8 md:p-12 mb-10">
          <img
            src={logo}
            alt="Logo"
            className="h-20 w-auto mb-6 opacity-90 drop-shadow"
            style={{ filter: "drop-shadow(0 6px 8px #c4b7a6cc)" }}
          />
          <h2 className="text-2xl font-bold mb-6 text-[#332214]">
            {isEditing ? "Edit Employee" : "Add Employee"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={!isEditing}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              {genders.map((g) => (
                <option key={g.genderId} value={g.genderId}>
                  {g.genderName}
                </option>
              ))}
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={`w-full ${
                isEditing
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white p-2 rounded`}
            >
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
            
            <Link
            to="/employees"
            className="text-blue-600 hover:underline"
            >
            View Employees
            </Link>


            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
