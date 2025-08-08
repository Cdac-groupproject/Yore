import React, { useState, useEffect } from "react";
import logo from "../assets/newLogo.png";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// Mock data for roles and genders (replace with your API call if needed)
const mockRoles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Auctioneer" },
  { id: 3, name: "Support" },
];

const mockGenders = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

export default function AddEmployee() {
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [genderId, setGenderId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInInfo = sessionStorage.getItem("isLoggedIn");
    if (!loggedInInfo) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setRoles(mockRoles);
    setGenders(mockGenders);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const employeeData = {
      fullName,
      phoneNo,
      email,
      password,
      age: Number(age), // convert to number
      genderId: Number(genderId),
      roleId: Number(roleId),
    };

    console.log("Submitting employee data:", employeeData);

    // TODO: Replace with your API call here to submit employeeData
    // fetch('/api/employees', { method: 'POST', body: JSON.stringify(employeeData), headers: { 'Content-Type': 'application/json' } })

    setSubmitted(true);

    // Clear form
    setFullName("");
    setPhoneNo("");
    setEmail("");
    setPassword("");
    setAge("");
    setGenderId("");
    setRoleId("");
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#ece6da] to-[#d1c7b7] py-16 px-4">
        <div className="bg-white/90 backdrop-blur-lg border border-[#c4b7a6] rounded-3xl shadow-2xl flex flex-col items-center max-w-xl w-full p-8 md:p-12">
          <img
            src={logo}
            alt="YORE logo"
            className="h-20 w-auto mb-4 opacity-90 drop-shadow"
            style={{ filter: "drop-shadow(0 6px 8px #c4b7a6cc)" }}
          />
          <h1 className="font-playfair text-3xl text-[#332214] font-extrabold mb-2 tracking-tight text-center">
            Add Employee
          </h1>
          <p className="mb-8 text-[#604a2f] text-center">
            Register a new team member below—select their role and enter their info.
          </p>
          {submitted && (
            <div className="w-full mb-4 text-green-700 text-center bg-green-100 py-2 rounded shadow">
              Employee added successfully!
            </div>
          )}
          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#795b33] font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={fullName}
                placeholder="e.g., Shantaram"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Phone No</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={phoneNo}
                placeholder="e.g., 2323232323"
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={email}
                placeholder="e.g., shanta@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Age</label>
              <input
                type="number"
                required
                min={0}
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16]"
                value={age}
                placeholder="e.g., 25"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Gender</label>
              <select
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16] cursor-pointer"
                value={genderId}
                onChange={(e) => setGenderId(e.target.value)}
              >
                <option value="" disabled>
                  Select gender
                </option>
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#795b33] font-medium mb-1">Role</label>
              <select
                required
                className="w-full px-4 py-2 rounded-md border border-[#b9a78b] focus:ring-2 focus:ring-[#b59f77] outline-none bg-white text-[#3c2d16] cursor-pointer"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#b59f77] via-[#e9dfc4] to-[#827058] text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
            >
              Add Employee
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
