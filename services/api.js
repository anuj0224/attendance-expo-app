import axios from 'axios';

// Base URL for your backend
const BASE_URL = 'http://10.11.39.196:5000/api';

// API function to login a user
export const loginUser = async (employee_id, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { employee_id, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}

export const updateEmployee = async (userId, employee) => {
  try {
    const response = await axios.put(`${BASE_URL}/user/${userId}`, employee);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}

export const getLeaveTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/attendanceType`);
    const fetchleaves=response.data.filter((leave)=>leave.is_leave===true);
    return fetchleaves;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}

export const getHolidays = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/holiday`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
}