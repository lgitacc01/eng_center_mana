import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB...");

    // Xóa các index cũ bị thừa (như user_id) để tránh lỗi trùng lặp
    await User.collection.dropIndexes(); 
    console.log("🔥 Đã xóa index cũ...");

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
        username: "admin1",
        password: hashedPassword, // SỬ DỤNG MẬT KHẨU ĐÃ BĂM
        full_name: "Administrator",
        email: "admin1@example.com",
        role_id: 1, // Admin
        phone: "0909000111",
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=random",
      },
      {
        username: "teacher1",
        password: hashedPassword,
        full_name: "Cô Linh",
        email: "linh.nguyen@dreamclass.vn",
        role_id: 2, // Giáo viên
        phone: "0901234567",
        specialization: "Grammar and Speaking",
        status: "active",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=100&h=100&fit=crop&crop=face",
      },
      {
        username: "student1",
        password: hashedPassword,
        full_name: "Nguyễn Minh An",
        email: "minhan@student.dreamclass.vn",
        role_id: 3,
        phone: "0908887776",
        parentName: "Nguyễn Văn A",
        parentPhone: "0901111111",
        studentClass: "A1",
        grade: "Cấp 1",
        averageScore: 8.5,
        status: "active",
        avatar: "https://ui-avatars.com/api/?name=Student+One&background=random",
      },
    ];

    await User.insertMany(usersToInsert); // Thêm mảng user mới

    console.log("✅ Đã thêm 3 user mẫu vào database!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi khi seed data:", err);
    process.exit(1);
  }
};

seedUsers();