import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig.js';
import { LogOut, User, Settings, BarChart } from 'lucide-react'; // Thêm icon cho đẹp

function AdminDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    // Gọi API của Admin
    api.get('/data/admin')
      .then(res => {
        setMessage(res.data.message); // Lấy message từ backend
      })
      .catch(err => {
        setError('Không thể tải dữ liệu Admin. Bạn không có quyền truy cập.');
      })
      .finally(() => {
        setLoading(false); // Dừng loading
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả token, role
    window.location.href = '/login'; // Quay về trang login
  };

  // --- NỘI DUNG CHÍNH (Chào mừng) ---
  const renderContent = () => {
    if (loading) {
      return <p className="text-2xl text-gray-400">Đang tải dữ liệu...</p>;
    }
    if (error) {
      return <p className="text-2xl text-red-500">{error}</p>;
    }
    if (message) {
      // Chào mừng ở chính giữa
      return (
        <h1 className="text-4xl font-bold text-center text-white animate-pulse">
          {message}
        </h1>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* --- NAVBAR/SIDEBAR "TO TO BÊN TRÁI" --- */}
      <nav className="w-72 bg-gray-800 shadow-2xl p-6 flex flex-col justify-between">
        {/* Phần trên của Navbar */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-600 pb-4">
            Admin Panel
          </h2>
          
          {/* Các link điều hướng (ví dụ) */}
          <ul className="space-y-4">
            <li className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200">
              <User className="mr-3 h-5 w-5" />
              Quản lý Users
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200">
              <BarChart className="mr-3 h-5 w-5" />
              Thống kê
            </li>
            <li className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200">
              <Settings className="mr-3 h-5 w-5" />
              Cài đặt
            </li>
          </ul>
        </div>
        
        {/* Phần dưới (Nút Logout) */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Đăng xuất
        </button>
      </nav>

      {/* --- PHẦN NỘI DUNG CHÍNH (BÊN PHẢI) --- */}
      <main className="flex-1 flex items-center justify-center p-10">
        {/* Đây là nơi nội dung chào mừng "chính giữa" */}
        {renderContent()}
      </main>
      
    </div>
  );
}

export default AdminDashboard;

