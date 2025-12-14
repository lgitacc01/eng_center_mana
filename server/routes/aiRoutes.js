import express from "express";
import { generateQuiz } from "../controllers/aiController.js";
import verifyToken from "../middleware/verifyToken.js"
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// POST /api/ai/generate-quiz
// Yêu cầu: Đăng nhập, Role 1(Admin) hoặc 2(Teacher)
router.post("/generate-quiz", verifyToken, checkRole([1, 2]), generateQuiz);

export default router;