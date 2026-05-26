import axios from 'axios';

const API = axios.create({
  // 🚀 Tries to read the Vercel variable first; falls back to your LIVE Render backend if missing
  baseURL: import.meta.env.VITE_API_URL || 'https://ledgerflow-backend-nobr.onrender.com/api', 
  withCredentials: true 
});

export default API;