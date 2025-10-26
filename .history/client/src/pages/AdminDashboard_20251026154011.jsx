import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// --- API "Chào mừng" (đã có) ---
// Endpoint: GET /data/admin
router.get(
  '/admin',
  verifyToken,    // 1. Xác thực
  checkRole([1]), // 2. Chỉ cho Admin
  (req, res) => {
    res.json({
      message: `Chào mừng Admin ${req.user.username}!`,
    });
  }
);

// --- API MỚI CHO TRANG "THÔNG TIN" ---
// Endpoint: GET /data/admin/info
router.get(
  '/admin/info',
  verifyToken,    // 1. Dùng lại middleware Xác thực
  checkRole([1]), // 2. Dùng lại middleware Chỉ cho Admin
  (req, res) => {
    // Đây là nơi bạn truy vấn CSDL để lấy thông tin
    // Tôi sẽ giả lập dữ liệu
    const adminInfo = {
      email: `${req.user.username}@admin.com`,
      joinedDate: '2023-01-01',
      permissions: 'All'
    };
    
    res.json({ adminInfo });
  }
);


// --- API của Teacher (đã có) ---
// Endpoint: GET /data/teacher
router.get(
  '/teacher',
  verifyToken,
  checkRole([2]), 
  (req, res) => {
    res.json({
      message: `Chào mừng Teacher ${req.user.username}!`,
    });
  }
);

// --- API của Student (đã có) ---
// Endpoint: GET /data/student
router.get(
  '/student',
  verifyToken,
  checkRole([3]), 
  (req, res) => {
    res.json({
      message: `Chào mừng Student ${req.user.username}!`,
    });
  }
);

export default router;
