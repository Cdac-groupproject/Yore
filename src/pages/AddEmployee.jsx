import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getRoles, getGenders } from "../services/userService";
import { myAxios } from "../services/config";
import logo from "../assets/newLogo.png";  // import your logo image

export default function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    age: "",
    gender: "", // Will store genderId as string
    role: "",   // Will store roleId as string
  });

  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    // Fetch genders
    getGenders()
      .then((res) => setGenders(res.data))
      .catch((err) => {
        console.error("Error fetching genders:", err);
      });

    // Fetch roles
    getRoles()
      .then((res) => setRoles(res.data))
      .catch((err) => {
        console.error("Error fetching roles:", err);
      });

    fetchUsers(); // Fetch user list on mount
  }, []);

  const fetchUsers = () => {
    setLoadingUsers(true);
    myAxios.get("/api/users/all")
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoadingUsers(false));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    myAxios.delete(`/api/users/${id}`)
      .then(() => {
        alert("User deleted successfully");
        fetchUsers(); // refresh list
      })
      .catch((err) => {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user");
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
      await myAxios.post("/api/users/manager/addEmployee", payload);
      alert("Employee added successfully!");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        role: "",
      });
      fetchUsers(); // refresh user list after adding
      //navigate("/employees"); // if you want to redirect instead
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
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
          <h2 className="text-2xl font-bold mb-6 text-[#332214]">Add Employee</h2>
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
              required
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
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Employee
            </button>
          </form>
        </div>

        {/* User List */}
        <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-[#332214]">Employees List</h3>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Phone</th>
                  <th className="py-2 px-4">Age</th>
                  <th className="py-2 px-4">Role</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4">{user.fullName}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.phoneNo}</td>
                    <td className="py-2 px-4">{user.age}</td>
                    <td className="py-2 px-4">{user.role?.roleName || "N/A"}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
