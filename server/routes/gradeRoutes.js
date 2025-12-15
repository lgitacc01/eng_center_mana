import express from "express";
import checkRole from "../middleware/checkRole.js";
import verifyToken from "../middleware/verifyToken.js";

import { getStudentReport, getClassGrades } from "../controllers/gradeReportController.js";

const router = express.Router();

const teacherRoles = [1, 2];

router.get("/class/:classId", verifyToken, checkRole(teacherRoles), getClassGrades);

router.get("/my-grades", verifyToken, getStudentReport);

export default router;