import React, { useState, useEffect } from 'react';
// 1. Import Link và Outlet từ React Router DOM
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import { 
  LogOut, 
  Book, // Icon cho "Xem tài liệu"
  HelpCircle, // Icon cho "Quiz AI"
  Home // Icon Home nếu muốn có trang chủ sinh viên
} from 'lucide-react'; 
import api from '../../api/apiConfig'; // Giữ nguyên nếu bạn vẫn cần gọi API ban đầu

function StudentDashboard() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate

  useEffect(() => {
    // Vẫn giữ phần gọi API nếu cần hiển thị thông tin ban đầu khi load dashboard
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
    navigate('/login'); // Dùng navigate để chuyển hướng
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
            {/* Mục "Xem tài liệu" */}
            <Link 
              to="/student/documents" // Đường dẫn đến trang xem tài liệu của sinh viên
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <Book className="mr-3 h-5 w-5" />
              Xem tài liệu
            </Link>
            
            {/* Mục "Quiz AI" */}
            <Link 
              to="/student/quiz-ai" // Đường dẫn đến trang Quiz AI
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Quiz AI
            </Link>

            {/* Bạn có thể thêm một mục Home nếu muốn có một trang chủ riêng cho sinh viên */}
            {/* <Link 
              to="/student/home" 
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-200"
            >
              <Home className="mr-3 h-5 w-5" />
              Trang chủ
            </Link> */}

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
        {/* Đây là nơi các trang con (ví dụ: StudentDocuments, StudentQuizAI) hiển thị */}
        <Outlet /> 
      </main>
      
    </div>
  );
}

export default StudentDashboard;