import axios from 'axios';

const API = axios.create({
  // 🔥 SWITCH THIS FROM 127.0.0.1 TO localhost TO MATCH ORIGIN EXPECTATIONS
  baseURL: 'http://localhost:8000/api', 
  withCredentials: true 
});

export default API;