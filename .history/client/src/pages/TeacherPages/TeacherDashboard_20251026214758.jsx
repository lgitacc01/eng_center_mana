import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig.js';

function TeacherDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Gọi API của Teacher
    api.get('/data/teacher')
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        setError('Không thể tải dữ liệu Teacher');
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Trang Teacher</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default TeacherDashboard;
