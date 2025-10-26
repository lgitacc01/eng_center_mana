// File: services/apiConfig.js

import axios from 'axios';

// 1. TẠO INSTANCE AXIOS
const api = axios.create({
  // URL gốc của backend (KHÔNG CÓ /api)
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // 👈 ĐÃ SỬA
  headers: {
    'Content-Type': 'application/json',
  }
});

