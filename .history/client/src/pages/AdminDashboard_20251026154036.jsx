import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig.js';

function AdminHomePage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // API này là API "Chào mừng"
    api.get('/data/admin')
      .then(res => {
        setMessage(res.data.message); 
      })
      .catch(err => {
        setError('Không thể tải dữ liệu Admin.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-2xl text-gray-400">Đang tải dữ liệu...</p>;
  }
  if (error) {
    return <p className="text-2xl text-red-500">{error}</p>;
  }
  if (message) {
    return (
      <h1 className="text-4xl font-bold text-center text-white animate-pulse">
        {message}
      </h1>
    );
  }
  return null;
}

export default AdminHomePage;
