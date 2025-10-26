import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig.js';

function AdminDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Gọi API của Admin
    api.get('/data/admin')
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        // Lỗi này không nên xảy ra nếu ProtectedRoute làm đúng
        setError('Không thể tải dữ liệu Admin');
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Trang Admin</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default AdminDashboard;
