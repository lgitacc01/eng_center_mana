import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role_id: { type: Number, required: true }, // 1: Admin, 2: Teacher, 3: Student
  phone: { type: String, default: "" },
  status: { type: String, default: "active" }, // active/inactive
  avatar: { type: String, default: "" },

  // --- TRƯỜNG RIÊNG CHO GIÁO VIÊN ---
  specialization: { type: String, default: "" }, // Chuyên môn

  // --- TRƯỜNG RIÊNG CHO HỌC SINH (Mới thêm) ---
  parentName: { type: String, default: "" },  // Tên phụ huynh
  parentPhone: { type: String, default: "" }, // SĐT phụ huynh
  studentClass: { type: String, default: "" }, // Lớp (VD: A1, B2) - Tránh trùng tên class của JS
  grade: { type: String, default: "" },       // Khối/Cấp (VD: Cấp 2, Cấp 3, Đại học)
  averageScore: { type: Number, default: 0 }, // Điểm trung bình
}, { 
  timestamps: true, // Tự động tạo createdAt, updatedAt
  collection: "users" // 👈 chỉ định collection là "users"
}); 

const User = mongoose.model("User", userSchema);
export default User;
