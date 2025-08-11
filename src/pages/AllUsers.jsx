import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import Navbar from "../components/Navbar";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading users...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-yellow-800 tracking-wide">
          User List
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
            <thead className="bg-yellow-700">
              <tr>
                {/* <th>ID</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`transition-colors duration-300 ${
                      idx % 2 === 0 ? "bg-yellow-50" : "bg-yellow-100"
                    } hover:bg-yellow-200 cursor-pointer`}
                  >
                    {/* <td>{user.id}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {user.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {user.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-800 font-semibold">
                      {user.role}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllUsers;
