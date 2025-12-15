import { StrictMode, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import './styles/globals.css';

// --- Import các trang (Pages) ---
import SplashScreen from './pages/SplashScreen.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginForm from './pages/LoginForm.jsx';
import { MainLayout } from './pages/MainLayout.jsx';
import { AuthProvider } from './pages/AuthProvider.jsx';
import StudentDashboard from './pages/StudentPages/StudentDashboard.jsx';
import TeacherDashboard from './pages/TeacherPages/TeacherDashboard.jsx';
import AdminDashboard from './pages/AdminPages/AdminDashboard.jsx';

// IMPORT TRANG CON CỦA ADMIN 
import AdminInfoPage from './pages/AdminPages/AdminInforPage.jsx';
import AdminClassesPage from './pages/AdminPages/AdminClasses.jsx';
import AdminStudentsPage from './pages/AdminPages/AdminStudents.jsx';
import AdminTeachersPage from './pages/AdminPages/AdminTeachers.jsx';
import AdminMaterials from './pages/AdminPages/AdminMaterials.jsx';
import AdminReportPage from './pages/AdminPages/AdminReport.jsx';
import AdminSettingsPage from './pages/AdminPages/AdminSettings.jsx';

// IMPORT TRANG CON CỦA TEACHER
import TeacherAssignments from './pages/TeacherPages/TeacherAssignments.jsx';
import CreateAssignment from './pages/TeacherPages/CreateAssignment.jsx';
import TeacherClasses from './pages/TeacherPages/TeacherClasses.jsx';
import TeacherGrades from './pages/TeacherPages/TeacherGrades.jsx';
import TeacherMaterials from './pages/TeacherPages/TeacherMaterials.jsx';
import TeacherStudents from './pages/TeacherPages/TeacherStudents.jsx';
import TeacherSettings from './pages/TeacherPages/TeacherSettings.jsx';

// IMPORT TRANG CON CỦA STUDENT
import { StudentClasses } from './pages/StudentPages/StudentClasses.jsx';
import { StudentAssignments } from './pages/StudentPages/StudentAssignments.jsx';
import { StudentMaterials } from './pages/StudentPages/StudentMaterials.jsx';
import { StudentSettings } from './pages/StudentPages/StudentSettings.jsx';
import { StudentGrades } from './pages/StudentPages/StudentGrades.jsx';

import Schedule from './pages/Schedule.jsx';
// --- Import "Người gác cổng" ---
import ProtectedRoute from './components/ProtectedRoute.jsx';



// --- COMPONENT ĐIỀU HƯỚNG SPLASH SCREEN ---
// Component này sẽ quyết định hiển thị Splash hay Landing
// eslint-disable-next-line react-refresh/only-export-components
const AppEntry = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hiển thị Splash trong 2.5 giây
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Nếu đang loading thì hiện Splash, ngược lại hiện Landing
  return showSplash ? <SplashScreen /> : <LandingPage />;
};

// --- LAYOUT GỐC (ROOT LAYOUT) ---
// Đây là chìa khóa để sửa lỗi của bạn.
// Nó nằm TRONG Router (để dùng được useNavigate trong AuthProvider)
// Và nó BỌC lấy tất cả các trang con (để cung cấp useAuth cho LoginForm, MainLayout...)
// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// ĐỊNH NGHĨA TOÀN BỘ ROUTES
const router = createBrowserRouter([
{
    // Bọc toàn bộ ứng dụng bằng RootLayout
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <AppEntry />,
      },
      {
        path: '/login',
        element: <LoginForm />,
      },

      // --- ADMIN ROUTES ---
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles={[1]}>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'info', element: <AdminInfoPage /> },
          { path: 'classes', element: <AdminClassesPage /> },
          { path: 'students', element: <AdminStudentsPage /> },
          { path: 'teachers', element: <AdminTeachersPage /> },
          { path: 'materials', element: <AdminMaterials /> },
          { path: 'reports', element: <AdminReportPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { index: true, element: <Navigate to="/admin/dashboard" replace /> }
        ]
      },

      // --- TEACHER ROUTES ---
      {
        path: '/teacher',
        element: (
          <ProtectedRoute allowedRoles={[2]}>
             <MainLayout />
          </ProtectedRoute>
        ),
        children: [
           { path: 'dashboard', element: <TeacherDashboard /> },
           { path: 'classes', element: <TeacherClasses /> },
           { path: 'classes/students', element: <TeacherStudents /> },
           { path: 'assignments', element: <TeacherAssignments /> },
           { path: 'materials', element: <TeacherMaterials /> },
           { path: 'grades', element: <TeacherGrades /> },
           { path: 'schedule', element: <Schedule userRole="teacher"/> },
           { path: 'settings', element: <TeacherSettings />},
           { index: true, element: <Navigate to="/teacher/dashboard" replace /> }
        ]
      },

      // --- STUDENT ROUTES ---
      {
        path: '/student',
        element: (
          <ProtectedRoute allowedRoles={[3]}>
             <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <StudentDashboard /> },
          { path: 'classes', element:<StudentClasses /> },
          { path: 'assignments', element: <StudentAssignments /> },
          { path: 'materials', element: <StudentMaterials /> },
          { path: 'grades', element: <StudentGrades /> },
          { path: 'schedule', element: <Schedule userRole="student"/> },
          { path: 'settings', element: <StudentSettings /> },
          { index: true, element: <Navigate to="/student/dashboard" replace /> }
        ]
      },

      // --- FALLBACK ---
      {
        path: '*',
        element: <Navigate to="/login" replace />
      }
    ]
  }
]);

// RENDER APP
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <div className="min-h-screen bg-gray-900 text-white"> */}
    <div className="min-h-screen">
      <RouterProvider router={router} />
    </div>
  </StrictMode>
);