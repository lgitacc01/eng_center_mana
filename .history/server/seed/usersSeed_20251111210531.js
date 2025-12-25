import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // 👈 THÊM VÀO

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB...");

    await User.deleteMany(); // Xóa hết dữ liệu cũ
    console.log("🧹 Đã xóa user cũ...");

    // --- BĂM MẬT KHẨU ---
    // 1. Tạo "muối"
    const salt = await bcrypt.genSalt(10);
    // 2. Băm mật khẩu "123"
    const hashedPassword = await bcrypt.hash("123", salt);
    // ------------------------

    const usersToInsert = [
      {
        user_id: 1,
        username: "admin1",
        password: hashedPassword, // 👈 SỬ DỤNG MẬT KHẨU ĐÃ BĂM
        full_name: "Administrator",
        email: "admin1@example.com",
        role_id: 1,
      },
      {
        user_id: 2,
        username: "teacher1",
        password: hashedPassword, // 👈 SỬ DỤNG MẬT KHẨU ĐÃ BĂM
        full_name: "Teacher One",
        email: "teacher1@example.com",
        role_id: 2,
      },
      {
        user_id: 3,
        username: "student1",
        password: hashedPassword, // 👈 SỬ DỤNG MẬT KHẨU ĐÃ BĂM
        full_name: "Student One",
        email: "student1@example.com",
        role_id: 3,
      },
    ];

    await User.insertMany(usersToInsert); // Thêm mảng user mới

    console.log("✅ Đã thêm 3 user mẫu (với mật khẩu đã băm) vào database!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi khi seed data:", err);
    process.exit(1);
  }
};

seedUsers();