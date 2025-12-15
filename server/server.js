import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Routes của bạn
import userRoutes from "./routes/userRoutes.js";

// Routes chúng ta vừa tạo
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classRoutes from "./routes/classRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";

import verifyToken from "./middleware/verifyToken.js";
import checkRole from "./middleware/checkRole.js";

dotenv.config();
  
const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH THƯ MỤC STATIC (QUAN TRỌNG CHO UPLOAD) ---
// Vì dùng ES Modules (import) nên không có sẵn __dirname, phải tự tạo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cho phép bên ngoài truy cập vào thư mục 'uploads' thông qua đường dẫn /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route test
app.get("/", (req, res) => {
  res.send("Hello from MongoDB Atlas!");
});
console.log("anh test eslint hehe");


// Route /users (của bạn)
app.use("/users", verifyToken, userRoutes);

// Routes xác thực (Auth)
// Endpoint: /auth/login, /auth/register
app.use("/auth", authRoutes);

// Routes dữ liệu (Data)
// Endpoint: /data/profile, /data/dashboard, v.v.
app.use("/data", dataRoutes);

// Route cho Giáo viên
app.use("/teachers", teacherRoutes);

// Route cho Hoc sinh
app.use("/students", studentRoutes);

// Đăng ký route cho lớp học
app.use("/classes", classRoutes);

// Routes Tài liệu (Materials) 👈 THÊM DÒNG NÀY
app.use("/materials", materialRoutes);

// Route AI
app.use("/ai", aiRoutes);

// Route Assignment
app.use("/assignments", assignmentRoutes);

// Route Submission
app.use("/submissions", submissionRoutes);

app.use("/api/grades", gradeRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});