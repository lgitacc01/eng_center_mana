import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany(); // Xóa hết dữ liệu cũ

    await User.insertMany([
      {
        user_id: 1,
        username: "admin1",
        password: "123",
        full_name: "Administrator",
        email: "admin1@example.com",
        role_id: 1, // ví dụ role_id=1 là admin
      },
      {
        user_id: 2,
        username: "teacher1",
        password: "123",
        full_name: "Teacher One",
        email: "teacher1@example.com",
        role_id: 2, // ví dụ role_id=2 là teacher
      },
    ]);

    console.log("✅ Đã thêm 2 user mẫu!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
console.log("Chạy hàm seedUsers.js để thêm user mẫu vào database.");

export default seedUsers;
