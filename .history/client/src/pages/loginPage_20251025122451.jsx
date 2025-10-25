import React, { useState } from 'react';
import api from '../api/apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Giả định endpoint là /login
      const response = await api.post('/login', { email, password });
      
      setMessage('Đăng nhập thành công!');
      // console.log(response.data); // Có thể chứa token

    } catch (error) {
      setMessage('Đăng nhập thất bại. Sai email hoặc mật khẩu.');
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Trang Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
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
        <p style={{ color: message.includes('thất bại') ? 'red' : 'green', marginTop: '15px' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;