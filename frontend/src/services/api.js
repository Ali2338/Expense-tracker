import axios from 'axios';

const API = axios.create({
  // 🚀 Tries to read the Vercel variable first; falls back to localhost if missing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', 
  withCredentials: true 
});

export default API;