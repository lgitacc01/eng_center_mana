// Tên file: routes/dataRoute.js
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// --- VAI TRÒ ĐÃ ĐỊNH NGHĨA ---
// role_id = 1 là Admin
// role_id = 2 là Teacher
// role_id = 3 là Student
// -----------------------------

// --- Route 1: Dùng chung (Cả 3 role đều xem được) ---
// Endpoint: GET /data/profile
router.get('/profile', verifyToken, (req, res) => {
  // Bất kỳ ai có token hợp lệ (Admin, Teacher, Student) đều vào được đây
  res.json({
    message: 'Đây là trang cá nhân của bạn',
    user: req.user 
  });
});

// --- Route 2: CHỈ DÀNH CHO ADMIN (1) ---
// (Ví dụ: tạo tài khoản, xem toàn bộ hệ thống)
// Endpoint: GET /data/admin-panel
router.get(
  '/admin-panel',
  verifyToken,     // 1. Kiểm tra đăng nhập
  checkRole([1]),  // 2. Kiểm tra role (Chỉ Admin)
  (req, res) => {
    res.json({
      message: 'Chào mừng Admin đến trang Admin Panel!',
      user: req.user
    });
  }
);

// --- Route 3: CHỈ DÀNH CHO TEACHER (2) ---
// (Ví dụ: xem danh sách lớp, chấm điểm)
// Endpoint: GET /data/teacher-dashboard
router.get(
  '/teacher-dashboard',
  verifyToken,       // 1. Kiểm tra đăng nhập
  checkRole([2]), // 2. Kiểm tra role (Chỉ Teacher)
  (req, res) => {
    res.json({
      message: 'Chào mừng Teacher đến trang quản lý lớp học!',
      user: req.user
    });
  }
);

// --- Route 4: CHỈ DÀNH CHO STUDENT (3) ---
// (Ví dụ: xem điểm cá nhân)
// Endpoint: GET /data/my-grades
router.get(
  '/my-grades',
  verifyToken,    // 1. Kiểm tra đăng nhập
  checkRole([3]), // 2. Kiểm tra role (Chỉ Student)
  (req, res) => {
    res.json({
        message: 'Đây là bảng điểm của bạn',
        student: req.user
    });
  }
);

export default router;