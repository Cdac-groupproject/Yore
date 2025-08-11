import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // change if needed
const token = localStorage.getItem("token");

// Fetch all categories
export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/getAllCategories`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};

// Fetch all countries
export const getAllCountries = async () => {
  const response = await axios.get(`${API_BASE_URL}/getAllCountries`, {headers: {Authorization: `Bearer ${token}`}});
  return response.data;
};


