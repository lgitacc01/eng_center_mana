// routes/submissionRoutes.js
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

import {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionById
} from "../controllers/submissionController.js";

const router = express.Router();

// Học viên nộp bài → role 3(Student)
router.post("/", verifyToken, checkRole([3]), submitAssignment);

// Giáo viên xem danh sách bài nộp
router.get("/assignment/:assignmentId", verifyToken, checkRole([1, 2]), getSubmissionsByAssignment);

// Xem chi tiết bài nộp
router.get("/:id", verifyToken, getSubmissionById);

export default router;
