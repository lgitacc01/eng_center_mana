import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    // 1. Đặt nền, chiều cao, và flex-col cho toàn bộ app
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
      {/* 2. Navbar giữ nguyên */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            className="font-semibold hover:text-blue-300 transition-colors"
          >
            Trang chủ
          </Link>
          <Link 
            to="/login"
            className="font-semibold hover:text-blue-300 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* 3. Thẻ <main> sẽ lấp đầy không gian còn lại (quan trọng) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}

export default App;