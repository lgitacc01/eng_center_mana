import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      
      <nav className="bg-gray-800 p-4 shadow-md w-full">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            // Thêm "text-white" vào đây
            className="text-white font-semibold hover:text-blue-300 transition-colors"
          >
            Trang chủ
          </Link>
          <Link 
            to="/login"
            // Thêm "text-white" vào đây
            className="text-white font-semibold hover:text-blue-300 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* Main sẽ tự lấp đầy */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
    </div>
  );
}

export default App;