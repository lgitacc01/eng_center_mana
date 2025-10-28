import React, { useState, useEffect } from 'react';
// 1. Import Link, Outlet và useNavigate
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import { 
  LogOut, 
  Book,         // Icon cho "Xem tài liệu"
  HelpCircle,   // Icon cho "Quiz AI"
  User          // 2. Thêm icon User cho "Thông tin"
} from 'lucide-react'; 
import api from '../../api/apiConfig'; 

function StudentDashboard() {
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    api.get('/data/student')
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        setError('Không thể tải dữ liệu Student');
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login'); 
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* --- NAVBAR/SIDEBAR "TO TO BÊN TRÁI" --- */}
      <nav className="w-72 bg-gray-800 shadow-2xl p-6 flex flex-col justify-between">
        {/* Phần trên của Navbar */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-600 pb-4">
            Student Panel
          </h2>
          
          <ul className="space-y-4">
            
            {/* 3. ĐÃ THÊM: Mục "Thông tin" lên đầu */}
            <Link 
              to="/student/info" // Đường dẫn đến trang thông tin
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <User className="mr-3 h-5 w-5" />
              Thông tin
            </Link>

            {/* Mục "Xem tài liệu" */}
            <Link 
              to="/student/documents" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <Book className="mr-3 h-5 w-5" />
              Xem tài liệu
            </Link>
            
            {/* Mục "Quiz AI" */}
            <Link 
              to="/student/quiz-ai" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Quiz AI
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
        {/* Đây là nơi các trang con hiển thị */}
        <Outlet /> 
      </main>
      
    </div>
  );
}

export default StudentDashboard;