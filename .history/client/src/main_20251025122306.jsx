import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Import các component
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

// 1. Tạo bộ định tuyến (router)
const router = createBrowserRouter([
  {
    path: "/",          // Đường dẫn gốc
    element: <App />,   // Sử dụng App làm layout chung
    children: [
      {
        path: "/",      // Khi ở đường dẫn "/", render HomePage
        element: <HomePage />,
      },
      {
        path: "/login", // Khi ở đường dẫn "/login", render LoginPage
        element: <LoginPage />,
      },
      // ... Thêm các trang khác ở đây
    ],
  },
]);

// 2. Render ứng dụng với RouterProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);