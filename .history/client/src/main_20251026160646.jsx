import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

// --- Import các trang (Pages) ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';

// --- Import "Người gác cổng" ---
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 👈 Đảm bảo bạn đã tạo file này

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
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[1]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
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

  // --- Route dự phòng ---
  // Nếu gõ một đường dẫn không tồn tại, chuyển về /login
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

// 2. RENDER APP
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Chỉ cần cung cấp router là đủ */}
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);

