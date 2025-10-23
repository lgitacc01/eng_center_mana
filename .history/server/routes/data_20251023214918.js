import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// --- Route 1: Chỉ cần đăng nhập (bất kỳ role nào) ---
// Endpoint: GET /data/profile
router.get('/profile', verifyToken, (req, res) => {
  // Nhờ verifyToken, chúng ta có req.user ở đây
  res.json({
    message: 'Đây là trang cá nhân của bạn',
    user: req.user
  });
});

// --- Route 2: Chỉ cho Manager (2) và Admin (1) ---
// Endpoint: GET /data/dashboard
router.get(
  '/dashboard',
  verifyToken, // 1. Kiểm tra đăng nhập
  checkRole([1, 2]), // 2. Kiểm tra role (Admin hoặc Manager)
  (req, res) => {
    res.json({
      message: 'Chào mừng đến trang quản lý dashboard!',
      user: req.user
    });
  }
);

// --- Route 3: Chỉ cho Admin (1) ---
// Endpoint: DELETE /data/delete-user/123
router.delete(
  '/delete-user/:id',
  verifyToken, // 1. Kiểm tra đăng nhập
  checkRole([1]), // 2. Kiểm tra role (Chỉ Admin)
  (req, res) => {
    // (Logic xóa user ở đây...)
    res.json({
      message: `Admin (User: ${req.user.username}) đã xóa user ${req.params.id}`,
    });
  }
);

export default router;