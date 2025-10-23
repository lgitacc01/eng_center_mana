import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import seedUsers from "./seed/usersSeed.js";

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
  res.send("Hello from MongoDB Atlas!");
});
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
