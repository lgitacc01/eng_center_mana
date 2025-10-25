import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // Nạp CSS

// Import các component
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx'; // SỬA LỖI VIẾT HOA Ở ĐÂY

// 1. Tạo bộ định tuyến (router)
const router = createBrowserRouter([
  {
    path: "/",          
    element: <App />,   
    children: [
      {
        path: "/",      
        element: <HomePage />,
      },
      {
        path: "/login", 
        element: <LoginPage />,
      },
    ],
  },
]);

// 2. Render ứng dụng
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);