// src/api/authService.js
import axios from 'axios';
import API_URL from './config';

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },
  
  verifyToken: async (token) => {
    const response = await axios.get(`${API_URL}/verify-token`, {
      headers: { Authorization: token }
    });
    return response.data;
  }
};

export default authService;