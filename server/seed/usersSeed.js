import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany(); // Xóa hết dữ liệu cũ trong collection "users"

    await User.insertMany([
      {
        user_id: 1,
        username: "admin1",
        password: "123",
        full_name: "Administrator",
        email: "admin1@example.com",
        role_id: 1,
      },
      {
        user_id: 2,
        username: "teacher1",
        password: "123",
        full_name: "Teacher One",
        email: "teacher1@example.com",
        role_id: 2,
      },
      {
        user_id: 3,
        username: "student1",
        password: "123",
        full_name: "student One",
        email: "student1@example.com",
        role_id: 3,
      },
    ]);

    console.log("✅ Đã thêm 2 user mẫu vào eng_center_mana.users");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();
