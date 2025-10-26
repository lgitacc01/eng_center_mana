import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

// --- Import các trang (Pages) ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// --- CÁC TRANG ADMIN (CHA VÀ CON) ---
import AdminDashboard from './pages/AdminDashboard.jsx';   // 1. Đây là Layout (CHA)
import AdminHomePage from './pages/AdminHomePage.jsx';     // 2. Import trang con (Trang chủ Admin)
import AdminInfoPage from './pages/AdminInfoPage.jsx';     // 3. Import trang con (Trang Thông tin)

// --- Import các trang role khác ---
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

// --- Import "Người gác cổng" ---
import ProtectedRoute from './components/ProtectedRoute.jsx';

// 1. ĐỊNH NGHĨA TOÀN BỘ ROUTES Ở ĐÂY
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  
  // --- CÁC ROUTES ĐƯỢC BẢO VỆ ---

  // ⭐️ PHẦN SỬA ĐỔI CỦA ADMIN BẮT ĐẦU TỪ ĐÂY ⭐️
  {
    path: '/admin',
    // Element cha (AdminDashboard) chứa Navbar và <Outlet />
    // Nó được bọc bởi ProtectedRoute
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    // 4. THÊM CÁC ROUTES CON VÀO ĐÂY
    children: [
      {
        index: true, // Chạy khi path là '/admin'
        element: <AdminHomePage />
      },
      {
        path: 'info', // Chạy khi path là '/admin/info'
        element: <AdminInfoPage />
      },
      // Bạn có thể thêm các trang con khác ở đây
    ]
  },
  // ⭐️ PHẦN SỬA ĐỔI CỦA ADMIN KẾT THÚC TẠI ĐÂY ⭐️

  {
    path: '/teacher',
    element: (
      <ProtectedRoute allowedRoles={[2]}>
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute allowedRoles={[3]}>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },

  // --- Route dự phòng (Giữ nguyên) ---
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

// 2. RENDER APP (Giữ nguyên)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-900 text-white">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);

