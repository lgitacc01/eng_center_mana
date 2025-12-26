import express from "express";
import { createStudent, deleteStudent, getAllStudents } from "../controllers/studentController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// GET /students
router.get("/", verifyToken, getAllStudents);

// POST /students/create (Chỉ Admin thêm được)
router.post("/create", verifyToken, checkRole([1]), createStudent);

// DELETE /students/:id
router.delete("/:id", verifyToken, checkRole([1]), deleteStudent);

export default router;