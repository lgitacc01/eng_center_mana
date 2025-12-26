import express from "express";
import { getAllTechers, createTeacher, deleteTeacher } from "../controllers/teacherController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// GET /teachers - Lấy danh sách (Ai đăng nhập cũng xem được hoặc chỉ Admin/Teacher tùy bạn)
router.get("/", verifyToken, getAllTechers);

// POST /teachers/create - Thêm mới (Chỉ Admin role 1 mới được thêm)
router.post("/create", verifyToken, checkRole([1]), createTeacher);

// DELETE /teachers/:id - Xóa (Chỉ Admin role 1 mới được xóa)
router.delete("/:id", verifyToken, checkRole([1]), deleteTeacher);

export default router;