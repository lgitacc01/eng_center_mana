import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-gray-800/70 backdrop-blur-md p-4 shadow-md z-10">
        <div className="container mx-auto flex gap-6">
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

      {/* Nội dung bao phủ toàn màn hình */}
      <main className="flex items-center justify-center h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
