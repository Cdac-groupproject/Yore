import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation to AddEmployee
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import { myAxios } from "../services/config";

export default function EmployeesList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Navigation hook

  useEffect(() => {
    setLoading(true);
    myAxios
      .get("/api/users/all")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    myAxios
      .delete(`/api/users/${id}`)
      .then(() => {
        alert("User deleted successfully");
        setUsers(users.filter((u) => u.userId !== id));
      })
      .catch((err) => {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user");
      });
  };

  // ✅ New: Edit handler
  const handleEditUser = (user) => {
    navigate("/add-employee", { state: { user } }); // Pass data to AddEmployee
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7] py-16 px-4">
        <div className="max-w-6xl w-full bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#332214]">
              Employees List
            </h3>
            <img src={logo} alt="Logo" className="h-10" />
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
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
                  <tr
                    key={user.userId}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2 px-4">{user.fullName}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.phoneNo}</td>
                    <td className="py-2 px-4">{user.age}</td>
                    <td className="py-2 px-4">
                      {user.role?.roleName || "N/A"}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      {/* ✅ Edit Button */}
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
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
