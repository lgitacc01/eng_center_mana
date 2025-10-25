import { Outlet, Link } from 'react-router-dom';
// import './App.css'; // Bạn có thể xóa file App.css đi nếu muốn

function App() {
  return (
    <>
      {/* Thêm class Tailwind vào đây */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex gap-4">
          <Link 
            to="/" 
            className="text-white font-semibold hover:text-blue-300 transition-colors"
          >
            Trang chủ
          </Link>
          <Link 
            to="/login"
            className="text-white font-semibold hover:text-blue-300 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </nav>

      {/* <Outlet /> là nơi render các trang */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;