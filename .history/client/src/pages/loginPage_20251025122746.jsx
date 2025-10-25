import React, { useState } from 'react';
// Đảm bảo bạn đã đổi tên file/thư mục api.js thành api/apiConfig.js
import api from '../api/apiConfig'; 

const LoginPage = () => {
  // 1. Đổi 'email' thành 'username'
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // 2. Gửi 'username' lên server
      const response = await api.post('/login', { 
        username: username, // <-- Đã thay đổi
        password: password 
      });
      
      setMessage('Đăng nhập thành công!');
      // console.log(response.data); // Có thể chứa token

    } catch (error) {
      // 3. Cập nhật thông báo lỗi
      setMessage('Đăng nhập thất bại. Sai tên đăng nhập hoặc mật khẩu.'); 
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Trang Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        {/* 4. Cập nhật trường input cho Tên đăng nhập */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Tên đăng nhập:
          </label>
          <input
            type="text" // <-- Đổi từ 'email' sang 'text'
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // <-- Cập nhật hàm set
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {/* Hết phần thay đổi */}

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.gex.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>
          Đăng nhập
        </button>
      </form>
      
      {message && (
        <p style={{ color: message.includes('thất bại') ? 'red' : 'green', marginTop: '15px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;