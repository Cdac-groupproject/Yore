import axios from "axios";
import { myAxios } from "./config";

// Send otp during registration
export const registerUser = async (userData) => {
  return await myAxios.post("/sign-up", userData);
};

export const verifyOtp = async (email, otp) => {
  return await myAxios.post("/verify-user", null, {
    params: { email: email, otp: otp },
  });
};

export const loginUser = async (loginData) => {
  return await myAxios.post("/signin", loginData);
};
