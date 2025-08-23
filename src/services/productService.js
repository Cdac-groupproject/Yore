import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // change if needed
const token = sessionStorage.getItem("token");

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

// Create category
export const createCategory = async (categoryName) => {
  const response = await axios.post(
    `${API_BASE_URL}/manager/addCategory`,
    { name: categoryName },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Create country
export const createCountry = async (countryName) => {
  const response = await axios.post(
    `${API_BASE_URL}/manager/addCountry`,
    { countryName },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
