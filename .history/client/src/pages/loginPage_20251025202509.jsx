import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig.js';

// FIX: Tạo một đối tượng 'api' giả lập để component có thể chạy
// mà không bị lỗi biên dịch.
// Nó sẽ giả lập việc gọi API và trả về một lỗi (Promise.reject).
const api = {
  post: (url, data) => {
    console.log('Đang gọi API giả lập (POST):', url, data);
    // Giả lập một lỗi để bạn có thể thấy thông báo lỗi hiển thị
    return Promise.reject(new Error('API giả lập: Sai thông tin'));
  }
};


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/auth/login', { username, password });
      alert('Đăng nhập thành công!'); // Giữ lại alert theo yêu cầu
      navigate('/');
    } catch (error) {
      setMessage('Đăng nhập thất bại. Sai tên đăng nhập hoặc mật khẩu.');
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    // FIX: Thêm container full-screen để căn giữa
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center p-4">

      {/* Đây là toàn bộ code form của bạn, không thay đổi */}
      <div className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
          Đăng Nhập
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-300 text-sm font-medium mb-1"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 placeholder-gray-400"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-medium mb-1"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 placeholder-gray-400"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Đăng nhập
          </button>
        </form>

        {message && (
          <p className="text-red-400 text-center mt-4 text-sm font-medium">
            {message}
          </p>
        )}

        <p className="text-gray-400 text-center mt-6 text-sm">
          Chưa có tài khoản?{' '}
          <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition">
            Đăng ký ngay
          </span>
        </p>
      </div>
      
    </div>
  );
};

export default LoginPage;

