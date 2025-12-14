  // routes/assignmentRoutes.js
  import express from "express";
  import verifyToken from "../middleware/verifyToken.js";
  import checkRole from "../middleware/checkRole.js";

  import {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
  } from "../controllers/assignmentController.js";

  const router = express.Router();

  // Admin(1) + Teacher(2)
  const teacherRoles = [1, 2];


  router.post("/", verifyToken, checkRole(teacherRoles), createAssignment);

  router.get("/", verifyToken, getAssignments);

  router.get("/:id", verifyToken, getAssignmentById);

  router.put("/:id", verifyToken, checkRole(teacherRoles), updateAssignment);

  router.delete("/:id", verifyToken, checkRole(teacherRoles), deleteAssignment);

  export default router;
