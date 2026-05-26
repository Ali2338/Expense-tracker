import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ledgerflow-backend-nobr.onrender.com/api', 
  withCredentials: true 
});

export default API;