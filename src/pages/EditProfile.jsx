import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProfile = ({ isOpen, onClose, uname, uemail, onSave }) => {
  const [name, setName] = useState(uname);
  const [email, setEmail] = useState(uemail);

  useEffect(() => {
    setName(uname);
    setEmail(uemail);
  }, [uname, uemail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email });
    toast.success("Profile Updated!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[3px] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

        <input
          className="w-full mb-3 p-2 border rounded-md"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 border rounded-md"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
