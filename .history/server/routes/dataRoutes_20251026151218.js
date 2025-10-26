import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// --- VAI TRÒ ĐÃ ĐỊNH NGHĨA ---
// role_id = 1 là Admin
// role_id = 2 là Teacher
// role_id = 3 là Student
// -----------------------------

// --- Cửa 1: CHỈ DÀNH CHO ADMIN (1) ---
// Endpoint: GET /data/admin
router.get(
  '/admin',
  [verifyToken, checkRole([1])], // 1. Kiểm tra token, 2. Kiểm tra role 1
  (req, res) => {
    res.json({
      message: 'Chào mừng Admin!',
      data: 'Dữ liệu của Admin...'
    });
  }
);

// --- Cửa 2: CHỈ DÀNH CHO TEACHER (2) ---
// Endpoint: GET /data/teacher
router.get(
  '/teacher',
  [verifyToken, checkRole([2])], // 1. Kiểm tra token, 2. Kiểm tra role 2
  (req, res) => {
    res.json({
      message: 'Chào mừng Teacher!',
      data: 'Dữ liệu của Teacher...'
    });
  }
);

// --- Cửa 3: CHỈ DÀNH CHO STUDENT (3) ---
// Endpoint: GET /data/student
router.get(
  '/student',
  [verifyToken, checkRole([3])], // 1. Kiểm tra token, 2. Kiểm tra role 3
  (req, res) => {
    res.json({
        message: 'Chào mừng Student!',
        data: 'Dữ liệu của Student...'
    });
  }
);

export default router;
