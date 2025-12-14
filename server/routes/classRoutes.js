import express from "express";
import { createClass, deleteClass, getAllClasses, getClassById, updateClass } from "../controllers/classController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js"; 

const router = express.Router();

// GET /classes - Lấy danh sách (Admin, Teacher, Student đều xem được, tùy logic bạn muốn chặn không)
router.get("/", verifyToken, getAllClasses);

// GET /classes/:id - Xem chi tiết
router.get("/:id", verifyToken, getClassById);

// POST /classes/create - Chỉ Admin (1) được tạo
router.post("/create", verifyToken, checkRole([1]), createClass);

// DELETE /classes/:id - Chỉ Admin (1) được xóa
router.delete("/:id", verifyToken, checkRole([1]), deleteClass);

// Cập nhật lớp (Chỉ Admin)
router.put("/:id", verifyToken, checkRole([1]), updateClass);

export default router;