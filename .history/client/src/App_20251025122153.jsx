import { Outlet, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      {/* Đây là layout chung, bạn có thể đặt Navbar hoặc Header ở đây 
      */}
      <nav style={{ padding: '10px', background: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Trang chủ</Link>
        <Link to="/login">Đăng nhập</Link>
      </nav>

      {/* <Outlet /> là nơi các component con (HomePage, LoginPage) 
        sẽ được render tùy theo đường dẫn URL
      */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;