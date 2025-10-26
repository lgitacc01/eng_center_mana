import React from 'react';
// 1. Import Link, Outlet, và useNavigate
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  FilePlus,     // Icon cho "Thêm tài liệu"
  PlusCircle    // Icon cho "Thêm từ mới"
} from 'lucide-react'; 

function TeacherDashboard() {
  const navigate = useNavigate();

  // 2. Dùng hàm logout giống Admin
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); // Dùng navigate
  };

  return (
    // 3. Dùng layout và class CSS y hệt Admin
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* --- NAVBAR/SIDEBAR "TO TO BÊN TRÁI" --- */}
      <nav className="w-72 bg-gray-800 shadow-2xl p-6 flex flex-col justify-between">
        
        {/* Phần trên của Navbar */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-600 pb-4">
            Teacher Panel {/* 4. Đổi tiêu đề */}
          </h2>
          
          {/* 5. Thay đổi các mục menu theo yêu cầu */}
          <ul className="space-y-4">

            {/* Tôi thêm mục "Thông tin" này cho giống với Admin */}
            <Link 
              to="/teacher/info" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <User className="mr-3 h-5 w-5" />
              Thông tin
            </Link>
            
            {/* Mục "Thêm tài liệu" bạn yêu cầu */}
            <Link 
              to="/teacher/add-document" // Đổi link cho phù hợp
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <FilePlus className="mr-3 h-5 w-5" />
              Thêm tài liệu
            </Link>

            {/* Mục "Thêm từ mới" bạn yêu cầu */}
            <Link 
              to="/teacher/add-word" // Đổi link cho phù hợp
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <PlusCircle className="mr-3 h-5 w-5" />
              Thêm từ mới
            </Link>

          </ul>
        </div>
        
        {/* Nút Logout (Giữ y hệt Admin) */}
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
        {/* 6. Dùng Outlet để các trang con hiển thị ở đây */}
        <Outlet /> 
      </main>
      
    </div>
  );
}

export default TeacherDashboard;