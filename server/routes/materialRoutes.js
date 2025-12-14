import express from 'express';
import { createMaterial, deleteMaterial, getMaterials, downloadMaterial, updateMaterial, approveMaterial} from '../controllers/materialController.js';

// Import Middlewares
import verifyToken from '../middleware/verifyToken.js';
import checkRole from '../middleware/checkRole.js';
import upload from '../middleware/uploadMiddleware.js'; // 👈 Import file vừa tạo

const router = express.Router();

// 1. Lấy danh sách
router.get('/', verifyToken, getMaterials);

// 2. Upload tài liệu (Chỉ GV & Admin)
router.post('/create', 
  verifyToken, 
  checkRole([1, 2]), 
  upload.single('file'), // 'file' là tên key trong FormData từ frontend
  createMaterial
);

// 3. Xóa tài liệu
router.delete('/:id', 
  verifyToken, 
  checkRole([1, 2]), 
  deleteMaterial
);

router.get("/download/:id", downloadMaterial);

// Route Sửa (PUT) - Cần có upload.single('file') để xử lý nếu người dùng thay đổi file
router.put("/:id", upload.single("file"), updateMaterial);

// Route Duyệt (Chỉ Admin role 1 được duyệt)
router.put("/approve/:id", verifyToken, checkRole([1]), approveMaterial);

export default router;