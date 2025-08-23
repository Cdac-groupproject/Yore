import axios from "axios";
import { myAxios } from "./config";

// Send otp during registration
export const registerUser = async (userData) => {
  return await myAxios.post("/signup", userData);
};

export const verifyOtp = async (email, otp) => {
  return await myAxios.post("/verifyuser", null, {
    params: { email: email, otp: otp },
  });
};

export const loginUser = async (loginData) => {
  return await myAxios.post("/signin", loginData);
};

export const updateProfile = async (profileData) => {
  return await myAxios.put("/edit-profile", profileData);
};

export const getUserById = async (userId) => {
  const token = sessionStorage.getItem("token");
  return axios.get(`http://localhost:8080/get-user?id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllUsers = async () => {
  const token = sessionStorage.getItem("token");
  return await myAxios.get("/users");
};

export const getGenders = async () => {
  return await myAxios.get("/api/genders");
};

export const getRoles = async () => {
  return await myAxios.get("/api/roles");
};
