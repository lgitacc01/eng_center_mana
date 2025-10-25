import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden relative">
      
      {/* Navbar nổi trên nền */}
      <nav className="absolute top-0 left-0 w-full bg-gray-800/70 backdrop-blur-md p-4 shadow-md z-10">
        <div className="flex gap-6 justify-center">
          <Link 
            to="/" 
            className="text-white font-semibold hover:text-blue-400 transition-colors"
          >
            Trang chủ
          </Link>
          <Link 
            to="/login"
            className="text-white font-semibold hover:text-blue-400 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* Phần nội dung chiếm toàn bộ màn hình */}
      <main className="flex items-center justify-center w-full h-full">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
