import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig'; 

const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // ... (logic handleLogin giữ nguyên) ...
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/auth/login', { username, password });
      alert('Đăng nhập thành công!');
      navigate('/'); 
    } catch (error) {
      setMessage('Đăng nhập thất bại. Sai tên đăng nhập hoặc mật khẩu.'); 
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    // 1. Dùng h-full để lấp đầy <main>
    // 2. Dùng flex để căn giữa form bên trong nó
    <div className="h-full flex items-center justify-center p-4"> 
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Đăng Nhập</h2>
        
        <form onSubmit={handleLogin}>
          {/* ... (Các input và button giữ nguyên) ... */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        
        {message && (
          <p className="text-red-500 text-center mt-4 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;