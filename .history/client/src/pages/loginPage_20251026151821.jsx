import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiConfig.js'; // Giữ nguyên đường dẫn import của bạn

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Sẽ dùng cho cả lỗi VÀ thành công
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Gọi API, backend sẽ trả về { accessToken, refreshToken, role }
      const response = await api.post('/auth/login', { username, password });

      // --- PHẦN ĐÃ SỬA LẠI ---

      // 1. LẤY DỮ LIỆU TỪ RESPONSE
      const { accessToken, refreshToken, role } = response.data;

      // 2. LƯU VÀO LOCALSTORAGE
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);

      // 3. ĐIỀU HƯỚNG DỰA TRÊN ROLE
      switch (role) {
        case 1:
          navigate('/admin');
          break;
        case 2:
          navigate('/teacher');
          break;
        case 3:
          navigate('/student');
          break;
        default:
          // Nếu role không xác định, về trang chủ
          navigate('/'); 
      }
      
      // --- KẾT THÚC PHẦN SỬA ---

    } catch (error) {
      // Lấy lỗi từ backend (ví dụ: "Sai thông tin đăng nhập")
      const errorMsg = error.response?.data?.msg || 'Đăng nhập thất bại.';
      setMessage(errorMsg);
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  return (
    // Toàn bộ phần UI (JSX) của bạn đã rất đẹp, giữ nguyên
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center p-4">
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
          // Hiển thị lỗi (màu đỏ)
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

