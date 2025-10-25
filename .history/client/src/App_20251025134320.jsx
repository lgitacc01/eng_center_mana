import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      
      {/* Navbar */}
      <nav className="bg-gray-800/90 backdrop-blur-md p-4 shadow-md w-full">
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

      {/* Outlet nằm trong main có flex-grow để lấp đầy */}
      <main className="flex-1 flex items-center justify-center min-h-screen">

        <Outlet />
      </main>
    </div>
  );
}

export default App;
