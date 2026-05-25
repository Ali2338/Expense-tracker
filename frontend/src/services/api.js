import axios from 'axios';

const API = axios.create({
  // 🚀 Pointing directly to your live production Render backend
  baseURL: 'https://ledgerflow-backend-nobr.onrender.com/api', 
  withCredentials: true 
});

export default API;