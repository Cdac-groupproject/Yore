import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateProfile } from "../services/userService";

const EditProfile = ({ isOpen, onClose, onSave }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setPhoneNo(user.phoneNo || "");
      setAge(user.age || "");
      setEmail(user.email || "");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      fullName: name,
      phoneNo,
      age,
      email: user.email,
    };

    try {
      console.log(updatedUser);
      const res = await updateProfile(updatedUser);
      console.log("result = " + res);
      toast.success("Profile updated successfully!");

      // update sessionStorage with new info
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      if (onSave) {
        onSave(updatedUser); // optional callback
      }

      onClose();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[3px] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <input
          className="w-full mb-3 p-2 border rounded-md"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded-md"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          className="w-full mb-3 p-2 border rounded-md"
          type="text"
          placeholder="Phone Number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded-md bg-gray-100 cursor-not-allowed"
          type="email"
          placeholder="Email"
          value={email}
          readOnly
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
