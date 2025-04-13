// src/api/evaluadorService.js
import axios from 'axios';
import API_URL from './config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token };
};

const evaluadorService = {
  asignarNino: async (ninoData) => {
    const response = await axios.post(`${API_URL}/evaluador/asignar-nino`, ninoData, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  getNinosAsignados: async () => {
    const response = await axios.get(`${API_URL}/evaluador/ninos`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
  
  // Más métodos según sea necesario
};

export default evaluadorService;