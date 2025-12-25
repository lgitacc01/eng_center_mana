import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes của bạn
import userRoutes from "./routes/userRoutes.js";

// Routes chúng ta vừa tạo
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import verifyToken from "./middleware/verifyToken.js";
import checkRole from "./middleware/checkRole.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB Atlas thành công!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route test
app.get("/", (req, res) => {
  res.send("Hello from MongoDB Atlas merge from main123!");

});


// Route /users (của bạn)
app.use("/users", verifyToken, checkRole, userRoutes);

// Routes xác thực (Auth)
// Endpoint: /auth/login, /auth/register
app.use("/auth", authRoutes);

// Routes dữ liệu (Data)
// Endpoint: /data/profile, /data/dashboard, v.v.
app.use("/data", dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});