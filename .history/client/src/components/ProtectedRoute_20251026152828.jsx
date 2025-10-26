import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Component này nhận vào 2 props:
// 1. children: Là trang mà nó bọc (ví dụ: <AdminDashboard />)
// 2. allowedRoles: Mảng các role được phép (ví dụ: [1])
function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  // 1. Lấy thông tin từ localStorage
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('role'); // Role được lưu dưới dạng chuỗi '1', '2', '3'
  console.log('ProtectedRoute: userRole =', userRole);
  console.log(token)

  // 2. Kiểm tra có token không (đã đăng nhập chưa)
  if (!token) {
    // Nếu chưa, điều hướng về /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Kiểm tra xem role của user có nằm trong mảng role được phép không
  // (Chúng ta chuyển userRole thành số để so sánh)
  if (!allowedRoles.includes(Number(userRole))) {
    // Nếu không có quyền, quay về trang login
    // (Hoặc bạn có thể tạo trang "Không có quyền" - 403)
    console.warn(`Access denied: Role ${userRole} is not in ${allowedRoles}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Nếu vượt qua cả 2 kiểm tra: Cho phép hiển thị trang
  return children;
}

export default ProtectedRoute;
