import React from 'react';
// 1. Import Link và Outlet
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  FileText, 
  School,   
  Users,
  Home // Thêm icon Home
} from 'lucide-react'; 

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Dùng navigate
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
          
          {/* 2. Đổi <li> thành <Link> */}
          <ul className="space-y-4">
            <Link 
              to="/admin" // Link về trang chủ (AdminHomePage)
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <Home className="mr-3 h-5 w-5" />
              Trang chủ Admin
            </Link>

            <Link 
              to="/admin/info" // Link đến trang "Thông tin"
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <User className="mr-3 h-5 w-5" />
              Thông tin
            </Link>
            
            <Link 
              to="/admin/documents"
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <FileText className="mr-3 h-5 w-5" />
              Quản lí tài liệu
            </Link>

            <Link 
              to="/admin/classes"
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <School className="mr-3 h-5 w-5" />
              Quản lí lớp học
            </Link>

            <Link 
              to="/admin/accounts"
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <Users className="mr-3 h-5 w-5" />
              Quản lí tài khoản
            </Link>
          </ul>
        </div>
        
        {/* Nút Logout */}
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
        {/* 3. Đây là nơi các trang con (AdminHomePage, AdminInfoPage...) hiển thị */}
        <Outlet /> 
      </main>
      
    </div>
  );
}

export default AdminDashboard;

