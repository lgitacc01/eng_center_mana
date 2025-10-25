import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    // 1. Khung chính: cao min-h-screen, flex-col, nền tối
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
      {/* 2. Navbar: Luôn nằm trên cùng, chung cho mọi trang */}
      <nav className="bg-gray-800 p-4 shadow-md w-full">
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

      {/* 3. Main: Tự động lấp đầy không gian còn lại (nhờ flex-grow) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}

export default App;