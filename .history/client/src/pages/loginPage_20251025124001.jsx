import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig'; // Giả sử đây là file api.js của bạn

const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // *** ĐÃ SỬA LẠI ENDPOINT ***
      const response = await api.post('/auth/login', { 
        username: username,
        password: password 
      });
      // **************************
      
      // Giả sử backend trả về token khi thành công
      // const token = response.data.token;
      // localStorage.setItem('token', token); // Lưu token

      alert('Đăng nhập thành công!');
      navigate('/'); // Chuyển về trang chủ

    } catch (error) {
      setMessage('Đăng nhập thất bại. Sai tên đăng nhập hoặc mật khẩu.'); 
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Trang Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Tên đăng nhập:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px' }}>
          Đăng nhập
        </button>
      </form>
      
      {message && (
        <p style={{ color: 'red', marginTop: '15px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;