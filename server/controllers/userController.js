import User from "../models/User.js";
import Class from "../models/Class.js";
import bcrypt from "bcryptjs";

// Lấy tất cả users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo user mới
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy user theo user_id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật user theo user_id
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // 1. Tìm user cũ để so sánh sự thay đổi
    const oldUser = await User.findById(userId);
    if (!oldUser) return res.status(404).json({ message: "User not found" });

    // 2. Nếu là Học sinh (role 3) và có thay đổi lớp
    if (oldUser.role_id === 3 && updates.studentClass && updates.studentClass !== oldUser.studentClass) {
        
        // A. Nếu trước đó đã có lớp -> Rút khỏi lớp cũ
        if (oldUser.studentClass) {
             await Class.findByIdAndUpdate(oldUser.studentClass, {
                $pull: { students: userId } // Xóa ID học sinh khỏi mảng students của lớp cũ
            });
        }

        // B. Thêm vào lớp mới
        await Class.findByIdAndUpdate(updates.studentClass, {
            $addToSet: { students: userId } // Thêm ID học sinh vào mảng students của lớp mới (tránh trùng)
        });
    }

    // 3. Cập nhật thông tin User như bình thường
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Xóa user theo user_id
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ user_id: req.params.id });
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // 1. Tìm user trong DB
    // Lưu ý: userId trong params là _id của MongoDB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Người dùng không tồn tại" });
    }

    // 2. Kiểm tra mật khẩu hiện tại có đúng không
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu hiện tại không đúng" });
    }

    // 3. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Cập nhật vào DB
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Đổi mật khẩu thành công!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Lỗi server khi đổi mật khẩu" });
  }
};