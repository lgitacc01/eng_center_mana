import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

// --- Import các trang (Pages) ---
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TeacherDashboard from './pages/TeacherPages/TeacherDashboard.jsx';
import StudentDashboard from './pages/StudentPages/StudentDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AdminDashboard from './pages/AdminPages/AdminDashboard.jsx';

// 👇 1. IMPORT TRANG CON CỦA ADMIN 
import AdminInfoPage from './pages/AdminPages/AdminInforPage.jsx';
// (Giả sử bạn có các trang khác, bạn cũng sẽ import chúng ở đây)
// import AdminDocumentsPage from './pages/AdminDocumentsPage.jsx';
// import AdminClassesPage from './pages/AdminClassesPage.jsx';
// import AdminAccountsPage from './pages/AdminAccountsPage.jsx';


// --- Import "Người gác cổng" ---
import ProtectedRoute from './components/ProtectedRoute.jsx';

// ĐỊNH NGHĨA TOÀN BỘ ROUTES
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
    // 👇 2. THÊM ROUTES CON VÀO ĐÂY
    children: [
      {
        path: 'info', // Sẽ khớp với '/admin/info'
        element: <AdminInfoPage /> 
      },
      // {
      //   path: 'documents', // Sẽ khớp với '/admin/documents'
      //   element: <AdminDocumentsPage /> 
      // },
      // {
      //   path: 'classes', // Sẽ khớp với '/admin/classes'
      //   element: <AdminClassesPage /> 
      // },
      // {
      //   path: 'accounts', // Sẽ khớp với '/admin/accounts'
      //   element: <AdminAccountsPage /> 
      // },
    ]
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
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);

// RENDER APP
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-900 text-white">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);