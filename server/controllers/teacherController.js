import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Lấy ds giáo viên
export const getAllTechers = async (req, res) => {
    try {
    // Chỉ lấy user có role_id = 2, sắp xếp mới nhất lên đầu
    const teachers = await User.find({ role_id: 2 }).select("-password").sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Thêm giáo viên mới
export const createTeacher = async (req, res) => {
  const { full_name, username, password, email, phone, specialization } = req.body;

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!full_name || !username || !password || !email) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin bắt buộc!" });
    }

    // Kiểm tra trùng lặp
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "Tên đăng nhập hoặc Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newTeacher = new User({
      full_name,
      username,
      password: hashedPassword, // Lưu mật khẩu đã mã hóa
      email,
      phone,
      specialization,
      role_id: 2, // Cố định là Giáo viên
      status: "active",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random` // Avatar mặc định
    });

    await newTeacher.save();

    res.status(201).json({ msg: "Thêm giáo viên thành công", teacher: newTeacher });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// 3. Vô hiệu hóa/Kích hoạt giáo viên (Soft Delete)
export const deleteTeacher = async (req, res) => {
  // try {
  //   const deletedUser = await User.findOneAndDelete({ _id: req.params.id, role_id: 2 });
  //   if (!deletedUser) return res.status(404).json({ message: "Không tìm thấy giáo viên" });
  //   res.json({ message: "Đã xóa giáo viên thành công" });
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) return res.status(404).json({ msg: "Không tìm thấy giáo viên" });

    // Logic: Nếu đang active thì thành inactive, và ngược lại (Toggle)
    const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
    
    teacher.status = newStatus;
    await teacher.save();

    res.status(200).json({ msg: `Đã cập nhật trạng thái thành: ${newStatus}`, status: newStatus });
  } catch (error) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};